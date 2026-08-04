import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Shared button primitive, per docs/DESIGN_SYSTEM_SPEC.md's Buttons
 * section: one underlying primitive differing only in visual emphasis
 * (variant/size), never in interaction behavior. Colors reference the
 * existing fumadocs-ui "fd-*" theme tokens already established in
 * this codebase (app/global.css's neutral preset) rather than a new,
 * invented palette — see docs/DESIGN_SYSTEM_SPEC.md's Colors section
 * for why no new brand color is asserted here.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ' +
    'transition-colors disabled:pointer-events-none disabled:opacity-50 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2 ' +
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90',
        secondary: 'bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-secondary/80',
        ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
        outline: 'border border-fd-border bg-transparent hover:bg-fd-accent hover:text-fd-accent-foreground',
        destructive: 'bg-red-600 text-white hover:bg-red-600/90',
      },
      size: {
        default: 'h-9 px-4 py-2 [&_svg]:size-4',
        sm: 'h-8 rounded-md px-3 text-xs [&_svg]:size-3.5',
        lg: 'h-10 rounded-md px-6 [&_svg]:size-4',
        icon: 'size-9 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
