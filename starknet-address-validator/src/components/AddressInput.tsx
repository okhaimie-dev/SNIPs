import React, { useState, useCallback } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clipboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function AddressInput({
  value,
  onChange,
  placeholder = "Enter a Starknet address...",
  className
}: AddressInputProps) {
  const [isPasting, setIsPasting] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      setIsPasting(true);
      const text = await navigator.clipboard.readText();
      onChange(text.trim());
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      // Fallback: focus the textarea so user can paste manually
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    } finally {
      setIsPasting(false);
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const characterCount = value.length;
  const maxLength = 400; // Based on PRD requirements

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Address Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              "address-input min-h-[120px] resize-none pr-20",
              value.length > maxLength && "border-error focus-visible:ring-error"
            )}
            maxLength={maxLength}
            rows={4}
            aria-label="Starknet address input"
          />

          {/* Action buttons positioned over textarea */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePaste}
              disabled={isPasting}
              className="h-7 w-7 p-0 hover:bg-accent/50"
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              <Clipboard className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              disabled={!value}
              className="h-7 w-7 p-0 hover:bg-accent/50"
              title="Clear input"
              aria-label="Clear input"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Character count and action buttons row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePaste}
              disabled={isPasting}
              className="h-8"
            >
              <Clipboard className="h-3 w-3 mr-1" />
              {isPasting ? 'Pasting...' : 'Paste'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              disabled={!value}
              className="h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          <div className={cn(
            "text-muted-foreground",
            characterCount > maxLength && "text-error font-medium"
          )}>
            {characterCount}/{maxLength}
          </div>
        </div>

        {characterCount > maxLength && (
          <p className="text-sm text-error">
            Address is too long. Maximum {maxLength} characters allowed.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
