'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      'bg-gray-200 data-[state=checked]:bg-pink-600',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out',
        'translate-x-1 data-[state=checked]:translate-x-6'
      )}
    />
  </SwitchPrimitive.Root>
))

Switch.displayName = SwitchPrimitive.Root.displayName

export { Switch }
