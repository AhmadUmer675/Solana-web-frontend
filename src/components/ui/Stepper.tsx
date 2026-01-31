import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: Array<{
    id: number;
    label: string;
    icon: React.ReactNode;
  }>;
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                    : isActive
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_0_25px_rgba(139,92,246,0.6)] ring-4 ring-purple-500/30'
                    : 'bg-gray-700/50 border-2 border-gray-600'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <div className="text-white">{step.icon}</div>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium transition-colors ${
                  isCompleted || isActive
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : isActive
                    ? 'bg-gradient-to-r from-green-500 via-gray-600 to-gray-600'
                    : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
