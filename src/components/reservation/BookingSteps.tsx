
import React from 'react';
import { Calendar, UserRound, Check } from 'lucide-react';

export type BookingStep = 'dates' | 'contact' | 'confirm';

interface BookingStepsProps {
  currentStep: BookingStep;
}

const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  const steps = [
    { id: 'dates', label: 'Výběr termínu', icon: Calendar },
    { id: 'contact', label: 'Kontaktní údaje', icon: UserRound },
    { id: 'confirm', label: 'Potvrzení rezervace', icon: Check },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isPast = 
            (currentStep === 'contact' && step.id === 'dates') || 
            (currentStep === 'confirm' && (step.id === 'dates' || step.id === 'contact'));
          
          const StepIcon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <div className="flex items-center mb-4 md:mb-0">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full mr-3
                    ${isActive ? 'bg-forest-600 text-white' : ''}
                    ${isPast ? 'bg-forest-200 text-forest-700' : ''}
                    ${!isActive && !isPast ? 'bg-gray-100 text-gray-500' : ''}
                  `}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Krok {index + 1}</div>
                  <div className={`font-medium ${isActive ? 'text-forest-700' : 'text-gray-700'}`}>
                    {step.label}
                  </div>
                </div>
              </div>
              
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block w-16 h-px bg-gray-200 mx-4"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingSteps;
