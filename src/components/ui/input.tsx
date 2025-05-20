
import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isNumeric?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isNumeric, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow special keys (backspace, delete, arrows, etc.)
      if (
        e.key === 'Backspace' || 
        e.key === 'Delete' || 
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        e.key === 'Enter' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        ((e.ctrlKey || e.metaKey) && (
          e.key === 'a' || 
          e.key === 'c' || 
          e.key === 'v' || 
          e.key === 'x')
        )
      ) {
        return;
      }
      
      // Block any key that isn't a number
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (isNumeric) {
        const input = e.currentTarget;
        // Remove any non-digit characters
        const sanitizedValue = input.value.replace(/\D/g, '');
        
        // Only update if value changed to prevent cursor jumping
        if (sanitizedValue !== input.value) {
          input.value = sanitizedValue;
        }
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isNumeric) {
        e.preventDefault();
        // Get pasted content and sanitize
        const pastedText = e.clipboardData.getData('text');
        const sanitizedText = pastedText.replace(/\D/g, '');
        
        // Insert at cursor position
        const input = e.currentTarget;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        
        const beforeText = input.value.substring(0, start);
        const afterText = input.value.substring(end);
        
        // Update input value
        input.value = beforeText + sanitizedText + afterText;
        
        // Move cursor to end of inserted text
        const newCursorPos = start + sanitizedText.length;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 focus:placeholder:text-transparent placeholder:transition-colors placeholder:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onKeyDown={isNumeric ? handleKeyDown : undefined}
        onInput={isNumeric ? handleInput : undefined}
        onPaste={isNumeric ? handlePaste : undefined}
        inputMode={isNumeric ? "numeric" : undefined}
        pattern={isNumeric ? "[0-9]*" : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
