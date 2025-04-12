
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Feature = ({ icon, title, description, className }: FeatureProps) => {
  return (
    <div className={cn("feature-card flex flex-col items-center text-center", className)}>
      <div className="text-forest-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Feature;
