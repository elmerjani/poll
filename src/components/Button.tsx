import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', ...props }, ref) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} transition-all`}
      ref={ref}
      {...props as any}
    >
      {children}
    </motion.button>
  )
);
