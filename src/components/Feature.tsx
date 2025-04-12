
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
  sm: 'text-3xl',
  md: 'text-4xl',
  lg: 'text-5xl'
};

const Feature = ({ 
  icon, 
  title, 
  description, 
  className,
  iconSize = 'md' 
}: FeatureProps) => {
  return (
    <div 
      className={cn(
        "feature-card flex flex-col items-center text-center p-6 hover:shadow-lg transition-all duration-300", 
        className
      )}
    >
      <div className={cn("text-forest-600 mb-4", iconSizeClasses[iconSize])}>
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Feature;
