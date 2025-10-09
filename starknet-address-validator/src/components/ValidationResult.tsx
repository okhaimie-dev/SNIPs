import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  CheckCircle,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationResult as ValidationResultType } from "@/lib/starknet-validator";
import { copyToClipboard, bytesToHex } from "@/lib/starknet-validator";

interface ValidationResultProps {
  result: ValidationResultType | null;
  address: string;
  className?: string;
}

export function ValidationResult({
  result,
  address,
  className,
}: ValidationResultProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (text: string, itemName: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  if (!result || !address.trim()) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Enter a Starknet address above to see validation results
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFormatBadgeVariant = (format: string) => {
    switch (format) {
      case "legacy":
        return "secondary";
      case "public":
        return "default";
      case "shielded":
        return "outline";
      case "unified":
        return "default";
      default:
        return "destructive";
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case "legacy":
        return "Traditional hex format (0x...)";
      case "public":
        return "SNIP-42 Public address (strk1...)";
      case "shielded":
        return "SNIP-42 Shielded address (strkx1...)";
      case "unified":
        return "SNIP-43 Unified address (strku1...)";
      default:
        return "Unknown or unsupported format";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {result.isValid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-error" />
            )}
            Validation Result
          </CardTitle>
          <Badge variant={result.isValid ? "success" : "error"}>
            {result.isValid ? "Valid" : "Invalid"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Format Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Format:</span>
            <Badge variant={getFormatBadgeVariant(result.format)}>
              {result.format.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {getFormatDescription(result.format)}
          </p>
        </div>

        {/* Error Message */}
        {!result.isValid && result.error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <p className="text-sm text-error font-medium">Error:</p>
            <p className="text-sm text-error">{result.error}</p>
          </div>
        )}

        {/* Parsed Data */}
        {result.isValid && result.parsed && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid gap-3">
              {result.parsed.hrp && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Human Readable Part:
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {result.parsed.hrp}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(result.parsed!.hrp!, "hrp")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {result.parsed.version !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Version:</span>
                  <Badge variant="outline">{result.parsed.version}</Badge>
                </div>
              )}

              {result.parsed.felt252 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Canonical Address:
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleCopy(result.parsed!.felt252!, "canonical")
                      }
                      className="h-6 w-6 p-0"
                      title={
                        copiedItem === "canonical"
                          ? "Copied!"
                          : "Copy canonical address"
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-xs bg-muted p-2 rounded block break-all monospace">
                    {result.parsed.felt252}
                  </code>
                </div>
              )}
            </div>

            {/* Unified Address Receivers */}
            {result.parsed.receivers && result.parsed.receivers.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">
                  Receivers ({result.parsed.receivers.length}):
                </h4>
                <div className="space-y-2">
                  {result.parsed.receivers.map((receiver, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Type {receiver.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {receiver.description || "Unknown receiver type"}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(
                              bytesToHex(receiver.data),
                              `receiver-${index}`,
                            )
                          }
                          className="h-6 w-6 p-0"
                          title={
                            copiedItem === `receiver-${index}`
                              ? "Copied!"
                              : "Copy receiver data"
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-muted p-2 rounded block break-all monospace">
                        {bytesToHex(receiver.data)}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full justify-between h-8"
              >
                <span className="text-sm font-medium">Technical Details</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showTechnicalDetails && (
                <div className="mt-3 space-y-3 p-3 bg-muted/30 rounded-md">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        Original Input:
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(address, "original")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs bg-background p-2 rounded block break-all monospace">
                      {address}
                    </code>
                  </div>

                  {result.parsed.payload && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Raw Payload:
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(
                              bytesToHex(result.parsed!.payload!),
                              "payload",
                            )
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <code className="text-xs bg-background p-2 rounded block break-all monospace">
                        {bytesToHex(result.parsed.payload)}
                      </code>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <p>• Length: {address.length} characters</p>
                    <p>• Format: {result.format}</p>
                    {result.parsed.payload && (
                      <p>
                        • Payload size: {result.parsed.payload.length} bytes
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCopy(address, "full-address")}
            className="flex-1"
          >
            <Copy className="h-3 w-3 mr-1" />
            {copiedItem === "full-address" ? "Copied!" : "Copy Address"}
          </Button>

          {result.isValid && result.parsed && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopy(JSON.stringify(result, null, 2), "json")
              }
              className="flex-1"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copiedItem === "json" ? "Copied!" : "Copy JSON"}
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              window.open(
                "https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-42.md",
                "_blank",
              )
            }
            className="px-3"
            title="View SNIP-42 Documentation"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        {/* Success Message */}
        {copiedItem && (
          <div className="text-center">
            <p className="text-sm text-success">✓ Copied to clipboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
