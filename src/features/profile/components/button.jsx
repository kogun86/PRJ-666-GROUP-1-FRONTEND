import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const buttonStyles = {
  base: 'button-base',
  variants: {
    default: 'button-default',
    destructive: 'button-destructive',
    outline: 'button-outline',
    secondary: 'button-secondary',
    ghost: 'button-ghost',
    link: 'button-link',
  },
  sizes: {
    default: 'button-size-default',
    sm: 'button-size-sm',
    lg: 'button-size-lg',
    icon: 'button-size-icon',
  },
};

function getButtonClassName(variant, size, className) {
  const classes = [
    buttonStyles.base,
    buttonStyles.variants[variant || 'default'],
    buttonStyles.sizes[size || 'default'],
  ];

  if (className) {
    classes.push(className);
  }

  return classes.join(' ');
}

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={getButtonClassName(variant, size, className)} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonStyles };
