'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Modal dialog primitive, per docs/DESIGN_SYSTEM_SPEC.md's Dialogs
 * section: shared focus-trap and Escape-to-close behavior, built on
 * Radix so both requirements are handled correctly without
 * reimplementing them.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out ' +
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
        <DialogPrimitive.Content
          className={cn(
            'relative w-full max-w-lg rounded-lg border border-fd-border bg-fd-popover p-0 ' +
              'text-fd-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out ' +
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 ' +
              'data-[state=open]:zoom-in-95',
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-fd-background transition-opacity',
                'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-fd-ring focus:ring-offset-2',
              )}
              aria-label="Close"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 border-b border-fd-border p-4', className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn('text-sm font-semibold', className)} {...props} />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-fd-muted-foreground', className)}
      {...props}
    />
  );
}
