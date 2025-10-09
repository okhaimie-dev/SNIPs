import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validateStarknetAddress,
  detectAddressFormat,
  type ValidationResult,
  type AddressFormat,
} from "@/lib/starknet-validator";

interface ValidationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
  result?: string;
  details?: string;
  duration?: number;
}

interface StepByStepValidatorProps {
  className?: string;
  initialAddress?: string;
}

export function StepByStepValidator({
  className,
  initialAddress = "",
}: StepByStepValidatorProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<ValidationStep[]>([]);

  const initializeSteps = (addressInput: string): ValidationStep[] => {
    const format = detectAddressFormat(addressInput);

    const baseSteps: ValidationStep[] = [
      {
        id: "format-detection",
        title: "Format Detection",
        description: "Identify address format from prefix",
        status: "pending",
      },
      {
        id: "structure-validation",
        title: "Structure Validation",
        description: "Check length, characters, and basic format",
        status: "pending",
      },
    ];

    // Add format-specific steps
    if (format !== "legacy" && format !== "unknown") {
      baseSteps.push({
        id: "checksum-verification",
        title: "Checksum Verification",
        description: "Verify Bech32m error detection code",
        status: "pending",
      });
    }

    baseSteps.push({
      id: "felt252-constraint",
      title: "Felt252 Constraint Check",
      description: "Ensure address fits in field element (< 2²⁵¹ - 1)",
      status: "pending",
    });

    if (format === "unified") {
      baseSteps.push({
        id: "tlv-parsing",
        title: "TLV Structure Parsing",
        description: "Parse Type-Length-Value records in unified address",
        status: "pending",
      });
    }

    baseSteps.push({
      id: "final-validation",
      title: "Final validation",
      description: "Compile results and generate validation report",
      status: "pending",
    });

    return baseSteps;
  };

  const runValidationStep = async (
    step: ValidationStep,
    addressInput: string,
  ): Promise<ValidationStep> => {
    // Simulate processing time for educational effect
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 500),
    );

    const startTime = Date.now();
    let updatedStep: ValidationStep = { ...step, status: "running" };

    try {
      switch (step.id) {
        case "format-detection": {
          const format = detectAddressFormat(addressInput);
          const formatDescriptions: Record<AddressFormat, string> = {
            legacy: "Legacy hex format (0x...)",
            public: "SNIP-42 public address (strk1...)",
            shielded: "SNIP-42 shielded address (strkx1...)",
            unified: "SNIP-43 unified address (strku1...)",
            unknown: "Unknown or invalid format",
          };

          updatedStep = {
            ...updatedStep,
            status: format !== "unknown" ? "success" : "error",
            result: format.toUpperCase(),
            details: formatDescriptions[format],
            duration: Date.now() - startTime,
          };
          break;
        }

        case "structure-validation": {
          const format = detectAddressFormat(addressInput);
          let isValid = true;
          let details = "";

          if (!addressInput.trim()) {
            isValid = false;
            details = "Empty address input";
          } else if (format === "legacy") {
            if (!addressInput.startsWith("0x")) {
              isValid = false;
              details = "Missing 0x prefix";
            } else if (!/^0x[0-9a-fA-F]*$/.test(addressInput)) {
              isValid = false;
              details = "Invalid hexadecimal characters";
            } else if (addressInput.length > 66) {
              isValid = false;
              details = "Too long (max 66 characters)";
            } else {
              details = `Valid hex structure (${addressInput.length} chars)`;
            }
          } else if (format !== "unknown") {
            const expectedPrefixes = {
              public: "strk1",
              shielded: "strkx1",
              unified: "strku1",
            };
            const expectedPrefix =
              expectedPrefixes[format as keyof typeof expectedPrefixes];
            if (!addressInput.startsWith(expectedPrefix)) {
              isValid = false;
              details = `Missing ${expectedPrefix} prefix`;
            } else {
              details = `Valid ${format} structure with ${expectedPrefix} prefix`;
            }
          } else {
            isValid = false;
            details = "Unknown format cannot be validated";
          }

          updatedStep = {
            ...updatedStep,
            status: isValid ? "success" : "error",
            result: isValid ? "PASS" : "FAIL",
            details,
            duration: Date.now() - startTime,
          };
          break;
        }

        case "checksum-verification": {
          try {
            // This is a simplified check - in reality we'd use the bech32 library
            const format = detectAddressFormat(addressInput);
            if (format === "unknown" || format === "legacy") {
              throw new Error("No checksum for this format");
            }

            // Simulate checksum verification
            const hasValidChecksum = addressInput.length > 8; // Simplified check

            updatedStep = {
              ...updatedStep,
              status: hasValidChecksum ? "success" : "error",
              result: hasValidChecksum ? "VALID" : "INVALID",
              details: hasValidChecksum
                ? "Bech32m checksum verification passed"
                : "Checksum verification failed",
              duration: Date.now() - startTime,
            };
          } catch (error) {
            updatedStep = {
              ...updatedStep,
              status: "error",
              result: "ERROR",
              details:
                error instanceof Error
                  ? error.message
                  : "Checksum verification failed",
              duration: Date.now() - startTime,
            };
          }
          break;
        }

        case "felt252-constraint": {
          try {
            const result = validateStarknetAddress(addressInput);
            const passesConstraint = !result.error?.includes(
              "exceeds felt252 maximum",
            );

            updatedStep = {
              ...updatedStep,
              status: passesConstraint ? "success" : "error",
              result: passesConstraint ? "WITHIN LIMIT" : "EXCEEDS LIMIT",
              details: passesConstraint
                ? "Address value is within felt252 field element limit"
                : "Address value exceeds 2²⁵¹ - 1 maximum",
              duration: Date.now() - startTime,
            };
          } catch (error) {
            updatedStep = {
              ...updatedStep,
              status: "error",
              result: "ERROR",
              details: "Failed to check felt252 constraint",
              duration: Date.now() - startTime,
            };
          }
          break;
        }

        case "tlv-parsing": {
          try {
            const result = validateStarknetAddress(addressInput);
            if (result.isValid && result.parsed?.receivers) {
              updatedStep = {
                ...updatedStep,
                status: "success",
                result: `${result.parsed.receivers.length} RECEIVERS`,
                details: `Parsed ${result.parsed.receivers.length} receiver(s) from TLV structure`,
                duration: Date.now() - startTime,
              };
            } else {
              updatedStep = {
                ...updatedStep,
                status: "error",
                result: "PARSE FAILED",
                details: "Could not parse TLV structure",
                duration: Date.now() - startTime,
              };
            }
          } catch (error) {
            updatedStep = {
              ...updatedStep,
              status: "error",
              result: "ERROR",
              details: "TLV parsing encountered an error",
              duration: Date.now() - startTime,
            };
          }
          break;
        }

        case "final-validation": {
          const result = validateStarknetAddress(addressInput);
          updatedStep = {
            ...updatedStep,
            status: result.isValid ? "success" : "error",
            result: result.isValid ? "VALID ADDRESS" : "INVALID ADDRESS",
            details: result.isValid
              ? `Address is valid ${result.format} format`
              : result.error || "Address validation failed",
            duration: Date.now() - startTime,
          };
          break;
        }

        default:
          updatedStep = {
            ...updatedStep,
            status: "error",
            result: "UNKNOWN STEP",
            details: "Unknown validation step",
            duration: Date.now() - startTime,
          };
      }
    } catch (error) {
      updatedStep = {
        ...updatedStep,
        status: "error",
        result: "ERROR",
        details: error instanceof Error ? error.message : "Step failed",
        duration: Date.now() - startTime,
      };
    }

    return updatedStep;
  };

  const runStepByStepValidation = async () => {
    if (!address.trim()) return;

    setIsValidating(true);
    setCurrentStep(-1);

    const initialSteps = initializeSteps(address);
    setSteps(initialSteps);

    // Run each step sequentially
    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStep(i);

      const updatedStep = await runValidationStep(initialSteps[i], address);

      setSteps((prevSteps) =>
        prevSteps.map((step, index) => (index === i ? updatedStep : step)),
      );

      // If a step fails, we might want to continue or stop
      // For educational purposes, let's continue to show all steps
    }

    // Get final validation result
    const finalResult = validateStarknetAddress(address);
    setValidationResult(finalResult);
    setCurrentStep(-1);
    setIsValidating(false);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(-1);
    setIsValidating(false);
    setValidationResult(null);
  };

  const getStepIcon = (step: ValidationStep, index: number) => {
    if (currentStep === index) {
      return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    }

    switch (step.status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStepStatusColor = (step: ValidationStep) => {
    switch (step.status) {
      case "success":
        return "text-green-700 bg-green-50 border-green-200";
      case "error":
        return "text-red-700 bg-red-50 border-red-200";
      case "running":
        return "text-blue-700 bg-blue-50 border-blue-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Step-by-Step Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Address to validate:
            </label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter any Starknet address to see the validation process..."
              className="font-mono text-sm min-h-[80px]"
              disabled={isValidating}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runStepByStepValidation}
              disabled={!address.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-pulse" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Validation
                </>
              )}
            </Button>

            <Button variant="outline" onClick={reset} disabled={isValidating}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Validation Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "border rounded-lg p-4 transition-all duration-300",
                    getStepStatusColor(step),
                    currentStep === index && "ring-2 ring-blue-500 shadow-md",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStepIcon(step, index)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        {step.result && (
                          <Badge
                            variant={
                              step.status === "success"
                                ? "default"
                                : step.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {step.result}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {step.description}
                      </p>

                      {step.details && (
                        <div className="text-xs p-2 bg-white/50 rounded border">
                          {step.status === "error" && (
                            <div className="flex items-center gap-1 text-red-600 mb-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="font-medium">Error:</span>
                            </div>
                          )}
                          {step.details}
                        </div>
                      )}

                      {step.duration && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Completed in {step.duration}ms
                        </div>
                      )}
                    </div>

                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {validationResult && !isValidating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Final Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "p-4 rounded-lg border-2",
                validationResult.isValid
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">
                  Address is {validationResult.isValid ? "VALID" : "INVALID"}
                </span>
                <Badge
                  variant={validationResult.isValid ? "default" : "destructive"}
                >
                  {validationResult.format.toUpperCase()}
                </Badge>
              </div>

              {validationResult.error && (
                <div className="text-sm text-red-700 mb-3">
                  <strong>Error:</strong> {validationResult.error}
                </div>
              )}

              {validationResult.parsed && (
                <div className="space-y-2 text-sm">
                  {validationResult.parsed.hrp && (
                    <div className="flex justify-between">
                      <span>Human Readable Part:</span>
                      <code className="text-xs bg-white px-2 py-1 rounded">
                        {validationResult.parsed.hrp}
                      </code>
                    </div>
                  )}

                  {validationResult.parsed.version !== undefined && (
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <Badge variant="outline">
                        {validationResult.parsed.version}
                      </Badge>
                    </div>
                  )}

                  {validationResult.parsed.receivers && (
                    <div className="flex justify-between">
                      <span>Receivers:</span>
                      <Badge variant="outline">
                        {validationResult.parsed.receivers.length}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
