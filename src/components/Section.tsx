
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  bgColor?: string;
}

const Section = ({ id, className, children, bgColor = 'bg-background' }: SectionProps) => {
  return (
    <section 
      id={id} 
      className={cn(
        'py-16 md:py-24',
        bgColor,
        className
      )}
    >
      <div className="section-container">
        {children}
      </div>
    </section>
  );
};

export default Section;
