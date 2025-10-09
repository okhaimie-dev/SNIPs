import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BookOpen,
  Eye,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Zap,
  Shield,
  Network,
  Hash,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationalContentProps {
  className?: string;
  onTryExample: (address: string) => void;
}

interface ExpandableSection {
  title: string;
  content: React.ReactNode;
  level: "beginner" | "intermediate" | "advanced";
}

export function EducationalContent({
  className,
  onTryExample,
}: EducationalContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLevel, setSelectedLevel] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const AddressStructureVisualizer = ({
    format,
    example,
  }: {
    format: string;
    example: string;
  }) => {
    const getStructure = () => {
      switch (format) {
        case "legacy":
          return [
            {
              part: "0x",
              description: "Prefix",
              color: "bg-blue-100 text-blue-800",
            },
            {
              part: example.slice(2, 10) + "...",
              description: "Hex Data (up to 64 chars)",
              color: "bg-green-100 text-green-800",
            },
          ];
        case "public":
          return [
            {
              part: "strk1",
              description: "HRP (Human Readable Part)",
              color: "bg-purple-100 text-purple-800",
            },
            {
              part: example.slice(5, 13) + "...",
              description: "Encoded Data + Checksum",
              color: "bg-orange-100 text-orange-800",
            },
          ];
        case "unified":
          return [
            {
              part: "strku1",
              description: "HRP (Unified)",
              color: "bg-indigo-100 text-indigo-800",
            },
            {
              part: example.slice(6, 14) + "...",
              description: "TLV Data + Checksum",
              color: "bg-red-100 text-red-800",
            },
          ];
        default:
          return [];
      }
    };

    return (
      <div className="space-y-2">
        <div className="font-mono text-sm bg-gray-50 p-2 rounded border">
          {getStructure().map((part, index) => (
            <span
              key={index}
              className={cn("px-1 py-0.5 rounded mr-1", part.color)}
            >
              {part.part}
            </span>
          ))}
        </div>
        <div className="text-xs space-y-1">
          {getStructure().map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded", part.color)}></div>
              <span>{part.description}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const InteractiveExample = ({
    title,
    address,
    format,
    description,
  }: {
    title: string;
    address: string;
    format: string;
    description: string;
  }) => (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{title}</h4>
        <Badge variant="outline">{format}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <AddressStructureVisualizer format={format} example={address} />
      <Button
        size="sm"
        variant="outline"
        onClick={() => onTryExample(address)}
        className="mt-3 w-full"
      >
        <Zap className="h-3 w-3 mr-2" />
        Try This Example
      </Button>
    </div>
  );

  const ExpandableEducationSection = ({
    id,
    title,
    level,
    children,
  }: {
    id: string;
    title: string;
    level: "beginner" | "intermediate" | "advanced";
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(id);
    const shouldShow = selectedLevel === "all" || selectedLevel === level;

    if (!shouldShow) return null;

    const levelColors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };

    return (
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="font-medium">{title}</span>
            <Badge className={levelColors[level]}>{level}</Badge>
          </div>
        </button>
        {isExpanded && (
          <div className="px-4 pb-4 border-t bg-gray-50/50">{children}</div>
        )}
      </div>
    );
  };

  const educationalSections: ExpandableSection[] = [
    {
      title: "What are Starknet Addresses?",
      level: "beginner",
      content: (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            Starknet addresses are unique identifiers for accounts and smart
            contracts on the Starknet network. Think of them like postal
            addresses for the blockchain - they tell the network exactly where
            to send transactions or find specific contracts.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Account Addresses
              </h5>
              <p className="text-xs text-muted-foreground">
                Used for user wallets and externally owned accounts (EOAs).
                These addresses can initiate transactions.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium flex items-center gap-2">
                <Hash className="h-4 w-4" /> Contract Addresses
              </h5>
              <p className="text-xs text-muted-foreground">
                Used for smart contracts deployed on Starknet. These addresses
                represent code that can be executed.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <strong>Key Insight:</strong> All Starknet addresses must fit
                within a "felt252" - a 252-bit field element. This mathematical
                constraint ensures compatibility with Starknet's Cairo virtual
                machine.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Legacy vs Modern Address Formats",
      level: "beginner",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h5 className="font-medium text-orange-700">
                🏛️ Legacy Format (0x...)
              </h5>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Structure:</strong> Hexadecimal with 0x prefix
                </p>
                <p>
                  <strong>Length:</strong> Up to 66 characters (0x + 64 hex
                  chars)
                </p>
                <p>
                  <strong>Benefits:</strong> Simple, familiar to Ethereum users
                </p>
                <p>
                  <strong>Drawbacks:</strong> No error detection, prone to typos
                </p>
              </div>
              <InteractiveExample
                title="Legacy Example"
                address="0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
                format="legacy"
                description="Traditional hex format - simple but no checksum protection"
              />
            </div>
            <div className="space-y-3">
              <h5 className="font-medium text-green-700">
                🚀 Modern Formats (SNIP-42/43)
              </h5>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Structure:</strong> Bech32m encoding with
                  human-readable prefix
                </p>
                <p>
                  <strong>Error Detection:</strong> Built-in checksums catch
                  typos
                </p>
                <p>
                  <strong>User Friendly:</strong> Clear format identification
                </p>
                <p>
                  <strong>Future Proof:</strong> Supports advanced features
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">strk1...</Badge>
                  <span>Public addresses</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">strkx1...</Badge>
                  <span>Shielded addresses</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">strku1...</Badge>
                  <span>Unified addresses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Understanding Bech32m Encoding",
      level: "intermediate",
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Bech32m is a Bitcoin-derived encoding scheme that provides superior
            error detection and user experience. Here's how it works in Starknet
            addresses:
          </p>
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <h5 className="font-medium mb-2">Encoding Process</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>
                    <strong>Start with binary data:</strong> Version byte +
                    address data
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>
                    <strong>Convert to 5-bit groups:</strong> Reshape 8-bit
                    bytes into 5-bit chunks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>
                    <strong>Add checksum:</strong> Calculate 6-character error
                    detection code
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <span>
                    <strong>Encode to base32:</strong> Convert to human-readable
                    characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                    5
                  </div>
                  <span>
                    <strong>Add prefix:</strong> Prepend Human Readable Part
                    (strk/strkx/strku)
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <h5 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Error Detection Benefits
              </h5>
              <ul className="text-sm space-y-1 text-green-800">
                <li>• Detects up to 4 character errors in any position</li>
                <li>• Catches common typos like swapped adjacent characters</li>
                <li>• Prevents sending to invalid addresses</li>
                <li>• Works even with partial address corruption</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "SNIP-43 Unified Addresses Deep Dive",
      level: "advanced",
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            Unified addresses are the most sophisticated address format, capable
            of containing multiple receiver types in a single address. They use
            TLV (Type-Length-Value) encoding to pack different payment
            destinations.
          </p>
          <div className="space-y-4">
            <div className="border rounded-lg p-3">
              <h5 className="font-medium mb-2">TLV Structure Breakdown</h5>
              <div className="font-mono text-xs bg-gray-100 p-2 rounded mb-2">
                strku1 | version | type₁ | len₁ | data₁ | type₂ | len₂ | data₂ |
                ... | checksum
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div>
                  <strong className="text-blue-600">Type (1 byte)</strong>
                  <p className="text-xs text-muted-foreground">
                    0x00 = Public key
                    <br />
                    0x01 = Shielded address
                    <br />
                    0x02+ = Future types
                  </p>
                </div>
                <div>
                  <strong className="text-green-600">Length (1 byte)</strong>
                  <p className="text-xs text-muted-foreground">
                    Number of bytes in the following data field (usually 32 for
                    addresses)
                  </p>
                </div>
                <div>
                  <strong className="text-purple-600">Value (variable)</strong>
                  <p className="text-xs text-muted-foreground">
                    The actual receiver data (address, public key, etc.)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <strong>Important:</strong> Unified addresses contain multiple
                  receiver options for the <em>same</em> recipient. When someone
                  sends to a unified address, their wallet selects ONE receiver
                  from the list - all funds go to that chosen receiver, not
                  split between multiple recipients.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium">Use Cases for Unified Addresses</h5>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="border rounded p-3">
                  <h6 className="font-medium text-sm mb-1">
                    💰 Payment Method Choice
                  </h6>
                  <p className="text-xs text-muted-foreground">
                    Recipients can offer multiple payment options (public for
                    transparency, shielded for privacy) and let senders choose.
                  </p>
                </div>
                <div className="border rounded p-3">
                  <h6 className="font-medium text-sm mb-1">
                    🔄 Wallet Migration
                  </h6>
                  <p className="text-xs text-muted-foreground">
                    Include both old and new wallet addresses during
                    transitions, ensuring continuity.
                  </p>
                </div>
                <div className="border rounded p-3">
                  <h6 className="font-medium text-sm mb-1">
                    🏢 Business Payment Options
                  </h6>
                  <p className="text-xs text-muted-foreground">
                    Organizations can offer multiple payment methods
                    (public/shielded) in one address for customer convenience.
                  </p>
                </div>
                <div className="border rounded p-3">
                  <h6 className="font-medium text-sm mb-1">
                    🔮 Future Compatibility
                  </h6>
                  <p className="text-xs text-muted-foreground">
                    Support new address types as they're developed without
                    breaking existing systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Validation Process Explained",
      level: "intermediate",
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            When you enter an address, the validator performs multiple checks to
            ensure it's valid and safe to use. Here's what happens behind the
            scenes:
          </p>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <h5 className="font-medium text-sm">Step 1: Format Detection</h5>
              <p className="text-xs text-muted-foreground">
                Examines the prefix (0x, strk1, strkx1, strku1) to determine the
                address format and select appropriate validation rules.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <h5 className="font-medium text-sm">
                Step 2: Structure Validation
              </h5>
              <p className="text-xs text-muted-foreground">
                Checks length, character set, and basic format requirements.
                Ensures only valid characters are used.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-3">
              <h5 className="font-medium text-sm">
                Step 3: Checksum Verification
              </h5>
              <p className="text-xs text-muted-foreground">
                For Bech32m addresses, verifies the built-in checksum to detect
                any transmission errors or typos.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <h5 className="font-medium text-sm">
                Step 4: Felt252 Constraint Check
              </h5>
              <p className="text-xs text-muted-foreground">
                Ensures the address value fits within Starknet's field element
                limit (less than 2²⁵¹ - 1).
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-3">
              <h5 className="font-medium text-sm">
                Step 5: Format-Specific Validation
              </h5>
              <p className="text-xs text-muted-foreground">
                For unified addresses, parses and validates the TLV structure.
                Ensures all receivers are properly formatted.
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <strong>Why Multiple Checks?</strong> Each validation step
                catches different types of errors - from simple typos to
                mathematical incompatibilities. This layered approach ensures
                maximum reliability.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Privacy and Address Types",
      level: "intermediate",
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-3 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h5 className="font-medium mb-1">Public Addresses</h5>
              <p className="text-xs text-muted-foreground">
                Fully transparent - all transactions and balances are visible on
                the blockchain.
              </p>
              <Badge variant="outline" className="mt-2">
                strk1...
              </Badge>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h5 className="font-medium mb-1">Shielded Addresses</h5>
              <p className="text-xs text-muted-foreground">
                Enhanced privacy features - transaction details can be hidden
                from public view.
              </p>
              <Badge variant="outline" className="mt-2">
                strkx1...
              </Badge>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Network className="h-6 w-6 text-purple-600" />
              </div>
              <h5 className="font-medium mb-1">Unified Addresses</h5>
              <p className="text-xs text-muted-foreground">
                Flexible addresses supporting multiple receiver types and
                privacy levels.
              </p>
              <Badge variant="outline" className="mt-2">
                strku1...
              </Badge>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <h5 className="font-medium mb-2">Privacy Considerations</h5>
            <ul className="text-sm space-y-1">
              <li>• Public addresses offer transparency and auditability</li>
              <li>
                • Shielded addresses provide privacy while maintaining security
              </li>
              <li>
                • Unified addresses let users choose privacy level per
                transaction
              </li>
              <li>
                • All formats support the same underlying security guarantees
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Educational Guide
            </CardTitle>
            <div className="flex gap-1">
              {(["all", "beginner", "intermediate", "advanced"] as const).map(
                (level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level)}
                    className="capitalize text-xs"
                  >
                    {level}
                  </Button>
                ),
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Learn about Starknet address formats, validation processes, and the
            technology behind SNIP-42/43. Select your experience level above to
            filter content.
          </p>
          <div className="space-y-4">
            {educationalSections.map((section, index) => (
              <ExpandableEducationSection
                key={index}
                id={`section-${index}`}
                title={section.title}
                level={section.level}
              >
                <div className="mt-4">{section.content}</div>
              </ExpandableEducationSection>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium">Address Format Prefixes</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <code>0x...</code>
                  <span className="text-muted-foreground">
                    Legacy hex format
                  </span>
                </div>
                <div className="flex justify-between">
                  <code>strk1...</code>
                  <span className="text-muted-foreground">SNIP-42 public</span>
                </div>
                <div className="flex justify-between">
                  <code>strkx1...</code>
                  <span className="text-muted-foreground">
                    SNIP-42 shielded
                  </span>
                </div>
                <div className="flex justify-between">
                  <code>strku1...</code>
                  <span className="text-muted-foreground">SNIP-43 unified</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Key Constraints</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Felt252 Max:</span>
                  <code className="text-xs">2²⁵¹ - 1</code>
                </div>
                <div className="flex justify-between">
                  <span>Legacy Max Length:</span>
                  <code>66 chars</code>
                </div>
                <div className="flex justify-between">
                  <span>Bech32m Checksum:</span>
                  <code>6 chars</code>
                </div>
                <div className="flex justify-between">
                  <span>Address Data Size:</span>
                  <code>32 bytes</code>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                Learn more about Starknet addressing:
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      "https://docs.starknet.io/documentation/",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Docs
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      "https://github.com/starknet-io/SNIPs",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  SNIPs
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
