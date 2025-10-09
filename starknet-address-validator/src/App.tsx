import { useState, useEffect } from "react";
import { AddressInput } from "./components/AddressInput";
import { ValidationResult } from "./components/ValidationResult";
import { EducationalContent } from "./components/EducationalContent";
import { StepByStepValidator } from "./components/StepByStepValidator";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  ExternalLink,
  Github,
  BookOpen,
  Zap,
  GraduationCap,
  Eye,
} from "lucide-react";
import {
  validateStarknetAddress,
  generateTestVector,
} from "./lib/starknet-validator";

function App() {
  const [address, setAddress] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "validator" | "education" | "step-by-step"
  >("validator");

  // Perform validation whenever address changes
  useEffect(() => {
    if (address.trim()) {
      const result = validateStarknetAddress(address);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [address]);

  const handleGenerateTestVector = (
    format: "legacy" | "public" | "shielded" | "unified",
  ) => {
    try {
      const testAddress = generateTestVector(format);
      setAddress(testAddress);
    } catch (error) {
      console.error("Failed to generate test vector:", error);
    }
  };

  const handleTryExample = (exampleAddress: string) => {
    setAddress(exampleAddress);
    setActiveTab("validator");
  };

  const supportedFormats = [
    {
      format: "legacy",
      prefix: "0x...",
      description: "Traditional hex addresses",
      color: "secondary",
    },
    {
      format: "public",
      prefix: "strk1...",
      description: "SNIP-42 public addresses",
      color: "default",
    },
    {
      format: "shielded",
      prefix: "strkx1...",
      description: "SNIP-42 shielded addresses",
      color: "outline",
    },
    {
      format: "unified",
      prefix: "strku1...",
      description: "SNIP-43 unified addresses",
      color: "default",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Starknet Address Validator
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Validate and parse Starknet addresses across multiple formats
            including SNIP-42 and SNIP-43
          </p>

          {/* SNIP Reference Links */}
          {/* Navigation Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={activeTab === "validator" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("validator")}
            >
              <Zap className="h-3 w-3 mr-1" />
              Validator
            </Button>
            <Button
              variant={activeTab === "education" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("education")}
            >
              <GraduationCap className="h-3 w-3 mr-1" />
              Learn
            </Button>
            <Button
              variant={activeTab === "step-by-step" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("step-by-step")}
            >
              <Eye className="h-3 w-3 mr-1" />
              Step-by-Step
            </Button>
          </div>

          {/* SNIP Reference Links */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  "https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-42.md",
                  "_blank",
                )
              }
            >
              <BookOpen className="h-3 w-3 mr-1" />
              SNIP-42
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.open(
                  "https://community.starknet.io/t/snip-43-unified-bech32m-addresses-and-viewing-keys-for-starknet/116001",
                  "_blank",
                )
              }
            >
              <BookOpen className="h-3 w-3 mr-1" />
              SNIP-43
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === "validator" && (
          <>
            {/* Supported Formats Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Supported Address Formats
                </CardTitle>
                <CardDescription>
                  This tool validates all current Starknet address formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportedFormats.map((format) => (
                    <div
                      key={format.format}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={format.color as any}>
                            {format.prefix}
                          </Badge>
                          <code className="text-sm">{format.format}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleGenerateTestVector(format.format as any)
                        }
                        className="ml-2"
                        title={`Generate ${format.format} test address`}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Input Section */}
            <div className="mb-6">
              <AddressInput
                value={address}
                onChange={setAddress}
                placeholder="Enter a Starknet address to validate...&#10;&#10;Examples:&#10;• 0x1234567890abcdef... (Legacy)&#10;• strk1... (SNIP-42 Public)&#10;• strkx1... (SNIP-42 Shielded)&#10;• strku1... (SNIP-43 Unified)"
              />
            </div>

            {/* Validation Results Section */}
            <div className="mb-8">
              <ValidationResult result={validationResult} address={address} />
            </div>

            {/* Quick Actions */}
            {!address && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                  <CardDescription>
                    Try these example addresses or generate random test vectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Example Addresses:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setAddress(
                              "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                            )
                          }
                          className="justify-start h-auto p-2"
                        >
                          <div className="text-left">
                            <div className="text-xs text-muted-foreground">
                              Legacy Address
                            </div>
                            <div className="monospace text-xs font-medium break-all">
                              0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
                            </div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddress("invalid-address-example")}
                          className="justify-start h-auto p-2"
                        >
                          <div className="text-left">
                            <div className="text-xs text-muted-foreground">
                              Invalid Example
                            </div>
                            <div className="monospace text-xs font-medium">
                              invalid-address-example
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Generate Test Vectors:
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateTestVector("legacy")}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Legacy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateTestVector("public")}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Public
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateTestVector("shielded")}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Shielded
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateTestVector("unified")}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Unified
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "education" && (
          <EducationalContent onTryExample={handleTryExample} />
        )}

        {activeTab === "step-by-step" && (
          <StepByStepValidator initialAddress={address} />
        )}

        {/* Footer Section */}
        <footer className="border-t pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open("https://github.com/starknet-io/SNIPs", "_blank")
                }
              >
                <Github className="h-4 w-4 mr-2" />
                Starknet SNIPs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open("https://community.starknet.io", "_blank")
                }
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Community
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>Built for the Starknet community</p>
              <p>Powered by proven Bitcoin Bech32m libraries</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              This tool runs entirely in your browser. No data is transmitted or
              stored.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
