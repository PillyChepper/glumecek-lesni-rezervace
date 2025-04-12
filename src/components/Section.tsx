
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  bgColor?: string;
  fullWidth?: boolean;
}

const Section = ({ 
  id, 
  className, 
  children, 
  bgColor = 'bg-background',
  fullWidth = false
}: SectionProps) => {
  return (
    <section 
      id={id} 
      className={cn(
        'py-16 md:py-24',
        bgColor,
        className
      )}
    >
      <div className={cn(
        fullWidth ? 'w-full' : 'section-container'
      )}>
        {children}
      </div>
    </section>
  );
};

export default Section;
