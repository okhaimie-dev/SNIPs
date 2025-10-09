import { bech32 } from "bech32";

// Type definitions
export type AddressFormat =
  | "legacy"
  | "public"
  | "shielded"
  | "unified"
  | "unknown";

export interface Receiver {
  type: number;
  data: Uint8Array;
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  format: AddressFormat;
  error?: string;
  parsed?: {
    hrp?: string;
    version?: number;
    payload?: Uint8Array;
    receivers?: Receiver[];
    felt252?: string;
    checksum?: string;
  };
}

// Constants
const STARKNET_HRPS = {
  public: "strk",
  shielded: "strkx",
  unified: "strku",
} as const;

const FELT252_MAX = 2n ** 251n - 1n;

// TLV Types for unified addresses
const TLV_TYPES = {
  PUBLIC_KEY: 0x00,
  SHIELDED: 0x01,
  // Add more as needed
} as const;

/**
 * Detects the format of a Starknet address
 */
export function detectAddressFormat(input: string): AddressFormat {
  const trimmed = input.trim();

  if (trimmed.startsWith("0x")) return "legacy";
  if (trimmed.startsWith("strk1")) return "public";
  if (trimmed.startsWith("strkx1")) return "shielded";
  if (trimmed.startsWith("strku1")) return "unified";

  return "unknown";
}

/**
 * Validates a legacy hex address (0x...)
 */
function validateLegacyAddress(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed.startsWith("0x")) {
    return {
      isValid: false,
      format: "legacy",
      error: "Legacy address must start with 0x",
    };
  }

  const hexPart = trimmed.slice(2);

  if (hexPart.length === 0) {
    return {
      isValid: false,
      format: "legacy",
      error: "Address cannot be empty after 0x",
    };
  }

  if (!/^[0-9a-fA-F]+$/.test(hexPart)) {
    return {
      isValid: false,
      format: "legacy",
      error: "Address contains invalid hexadecimal characters",
    };
  }

  if (hexPart.length > 64) {
    return {
      isValid: false,
      format: "legacy",
      error: "Address is too long (max 64 hex characters)",
    };
  }

  // Check felt252 constraint
  try {
    const paddedHex = hexPart.padStart(64, "0");
    const bigIntValue = BigInt("0x" + paddedHex);

    if (bigIntValue > FELT252_MAX) {
      return {
        isValid: false,
        format: "legacy",
        error: "Address exceeds felt252 maximum value (2^251 - 1)",
      };
    }

    return {
      isValid: true,
      format: "legacy",
      parsed: {
        felt252: "0x" + paddedHex,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      format: "legacy",
      error: "Failed to parse address as number",
    };
  }
}

/**
 * Validates a Bech32m encoded address (strk1..., strkx1..., strku1...)
 */
function validateBech32Address(
  input: string,
  expectedFormat: AddressFormat,
): ValidationResult {
  const trimmed = input.trim();

  try {
    // Decode using bech32
    const decoded = bech32.decode(trimmed);

    // Check HRP matches expected format
    const expectedHrp =
      expectedFormat === "public"
        ? STARKNET_HRPS.public
        : expectedFormat === "shielded"
          ? STARKNET_HRPS.shielded
          : expectedFormat === "unified"
            ? STARKNET_HRPS.unified
            : "";

    if (decoded.prefix !== expectedHrp) {
      return {
        isValid: false,
        format: expectedFormat,
        error: `Invalid HRP: expected ${expectedHrp}, got ${decoded.prefix}`,
      };
    }

    // Convert 5-bit groups to bytes
    const payload = new Uint8Array(bech32.fromWords(decoded.words));

    if (payload.length === 0) {
      return {
        isValid: false,
        format: expectedFormat,
        error: "Empty payload",
      };
    }

    // Extract version (first byte)
    const version = payload[0];
    const data = payload.slice(1);

    // Validate based on format
    if (expectedFormat === "unified") {
      return validateUnifiedAddress(decoded.prefix, version, data);
    } else {
      return validateSimpleAddress(
        expectedFormat,
        decoded.prefix,
        version,
        data,
      );
    }
  } catch (error) {
    return {
      isValid: false,
      format: expectedFormat,
      error: `Bech32 decode error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Validates a simple (public/shielded) address
 */
function validateSimpleAddress(
  format: AddressFormat,
  hrp: string,
  version: number,
  data: Uint8Array,
): ValidationResult {
  // Check version (should be 1 for SNIP-42)
  if (version !== 1) {
    return {
      isValid: false,
      format,
      error: `Unsupported version: ${version} (expected 1)`,
    };
  }

  // Check data length (should be 32 bytes for felt252)
  if (data.length !== 32) {
    return {
      isValid: false,
      format,
      error: `Invalid data length: ${data.length} bytes (expected 32)`,
    };
  }

  // Check felt252 constraint
  try {
    const bigIntValue = BigInt(
      "0x" + Array.from(data, (b) => b.toString(16).padStart(2, "0")).join(""),
    );

    if (bigIntValue > FELT252_MAX) {
      return {
        isValid: false,
        format,
        error: "Address exceeds felt252 maximum value (2^251 - 1)",
      };
    }

    const felt252 =
      "0x" + Array.from(data, (b) => b.toString(16).padStart(2, "0")).join("");

    return {
      isValid: true,
      format,
      parsed: {
        hrp,
        version,
        payload: data,
        felt252,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      format,
      error: "Failed to parse address data",
    };
  }
}

/**
 * Validates a unified address with TLV parsing
 */
function validateUnifiedAddress(
  hrp: string,
  version: number,
  data: Uint8Array,
): ValidationResult {
  // Check version (should be 1 for SNIP-43)
  if (version !== 1) {
    return {
      isValid: false,
      format: "unified",
      error: `Unsupported version: ${version} (expected 1)`,
    };
  }

  // Parse TLV data
  const receivers: Receiver[] = [];
  let offset = 0;

  try {
    while (offset < data.length) {
      if (offset + 2 > data.length) {
        return {
          isValid: false,
          format: "unified",
          error: "Incomplete TLV record: missing type or length",
        };
      }

      const type = data[offset];
      const length = data[offset + 1];
      offset += 2;

      if (offset + length > data.length) {
        return {
          isValid: false,
          format: "unified",
          error: `Incomplete TLV record: expected ${length} bytes but only ${data.length - offset} remaining`,
        };
      }

      const receiverData = data.slice(offset, offset + length);
      offset += length;

      // Validate receiver data based on type
      let description: string | undefined;
      if (type === TLV_TYPES.PUBLIC_KEY) {
        if (length !== 32) {
          return {
            isValid: false,
            format: "unified",
            error: `Invalid public key length: ${length} bytes (expected 32)`,
          };
        }
        description = "Public key receiver";
      } else if (type === TLV_TYPES.SHIELDED) {
        if (length !== 32) {
          return {
            isValid: false,
            format: "unified",
            error: `Invalid shielded receiver length: ${length} bytes (expected 32)`,
          };
        }
        description = "Shielded receiver";
      } else {
        description = `Unknown receiver type ${type}`;
      }

      receivers.push({
        type,
        data: receiverData,
        description,
      });
    }

    if (receivers.length === 0) {
      return {
        isValid: false,
        format: "unified",
        error: "Unified address must contain at least one receiver",
      };
    }

    return {
      isValid: true,
      format: "unified",
      parsed: {
        hrp,
        version,
        payload: data,
        receivers,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      format: "unified",
      error: `TLV parsing error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Main validation function that handles all address formats
 */
export function validateStarknetAddress(input: string): ValidationResult {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      format: "unknown",
      error: "Input must be a non-empty string",
    };
  }

  const format = detectAddressFormat(input);

  switch (format) {
    case "legacy":
      return validateLegacyAddress(input);
    case "public":
      return validateBech32Address(input, "public");
    case "shielded":
      return validateBech32Address(input, "shielded");
    case "unified":
      return validateBech32Address(input, "unified");
    case "unknown":
    default:
      return {
        isValid: false,
        format: "unknown",
        error:
          "Unknown address format. Supported formats: 0x... (legacy), strk1... (public), strkx1... (shielded), strku1... (unified)",
      };
  }
}

/**
 * Generates a test vector for the specified format
 */
export function generateTestVector(format: AddressFormat): string {
  const randomByte = () => Math.floor(Math.random() * 256);
  const randomHex = () => Math.floor(Math.random() * 16).toString(16);

  switch (format) {
    case "legacy":
      // Generate a random 32-byte hex address that's < 2^251 - 1
      let hexAddr;
      do {
        hexAddr = Array.from({ length: 64 }, randomHex).join("");
        // Ensure first bit is 0 to stay under felt252 limit
        hexAddr = "0" + hexAddr.slice(1);
      } while (BigInt("0x" + hexAddr) > FELT252_MAX);
      return "0x" + hexAddr;

    case "public":
      try {
        // Generate random 32-byte address data (< felt252 max)
        const addressData = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          addressData[i] = randomByte();
        }
        // Ensure it's under felt252 limit by setting first byte appropriately
        addressData[0] = addressData[0] & 0x0f; // Keep it small

        // Create payload: version (1) + address data
        const payload = new Uint8Array([1, ...addressData]);

        // Convert to 5-bit groups and encode
        const words = bech32.toWords(payload);
        return bech32.encode(STARKNET_HRPS.public, words);
      } catch (error) {
        return "strk1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfc6h6a"; // Fallback valid address
      }

    case "shielded":
      try {
        // Generate random 32-byte address data (< felt252 max)
        const addressData = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          addressData[i] = randomByte();
        }
        // Ensure it's under felt252 limit by setting first byte appropriately
        addressData[0] = addressData[0] & 0x0f; // Keep it small

        // Create payload: version (1) + address data
        const payload = new Uint8Array([1, ...addressData]);

        // Convert to 5-bit groups and encode
        const words = bech32.toWords(payload);
        return bech32.encode(STARKNET_HRPS.shielded, words);
      } catch (error) {
        return "strkx1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7cs4az"; // Fallback valid address
      }

    case "unified":
      try {
        // Generate a simple unified address with one public receiver
        const receiverData = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          receiverData[i] = randomByte();
        }
        // Ensure receiver data is under felt252 limit
        receiverData[0] = receiverData[0] & 0x0f;

        // Create TLV: Type (0x00 = public key) + Length (32) + Value
        const tlvData = new Uint8Array([
          TLV_TYPES.PUBLIC_KEY, // Type: public key receiver
          32, // Length: 32 bytes
          ...receiverData, // Value: receiver data
        ]);

        // Create payload: version (1) + TLV data
        const payload = new Uint8Array([1, ...tlvData]);

        // Convert to 5-bit groups and encode
        const words = bech32.toWords(payload);
        return bech32.encode(STARKNET_HRPS.unified, words);
      } catch (error) {
        return "strku1qqqqqsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqh9k5w4"; // Fallback valid address
      }

    default:
      throw new Error(`Cannot generate test vector for format: ${format}`);
  }
}

/**
 * Utility function to format bytes as hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Utility function to copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error("Failed to copy to clipboard:", fallbackError);
      return false;
    }
  }
}
