"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  textToCopy: string
  label?: string
  successLabel?: string
  onCopySuccess?: () => void
}

export function CopyButton({
  textToCopy,
  label,
  successLabel = "Copied!",
  onCopySuccess,
  className,
  size = "sm",
  variant = "outline",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (!textToCopy) return

      try {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        if (onCopySuccess) onCopySuccess()
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy script content:", err)
      }
    },
    [textToCopy, onCopySuccess]
  )

  return (
    <Button
      variant={copied ? "outline" : "outline"}
      size={size}
      onClick={handleCopy}
      aria-label={copied ? successLabel : label || "Copy script text"}
      title={label || "Copy to clipboard"}
      className={cn("transition-all duration-200 motion-reduce:transition-none", className)}
      {...props}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-white animate-in zoom-in-50 duration-150 motion-reduce:animate-none" />
          {label && <span>{successLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="size-3.5 shrink-0" />
          {label && <span>{label}</span>}
        </>
      )}
    </Button>
  )
}
