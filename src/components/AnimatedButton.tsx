'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md'
}) => {
  const baseClasses = 'btn font-medium transition-all duration-200';
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };
  const variantClasses = {
    primary: 'btn-primary glass border-0',
    secondary: 'btn-secondary glass border-0',
    outline: 'btn-outline text-white border-white hover:bg-white hover:text-primary'
  };

  const Component = href ? motion.a : motion.button;
  const props = href ? { href } : { onClick, disabled, type };

  return (
    <Component
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        y: disabled ? 0 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </Component>
  );
};

export default AnimatedButton; 