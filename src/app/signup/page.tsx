'use client';

import { FormProvider, useForm } from 'react-hook-form';
import BackgroundVideo from './BackgroundVideo';
import ValidationMessage from './ValidationMessage';
import SignupForm from './Form'; 

export default function SignupPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="h-screen w-screen fixed inset-0 overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/20 z-10">
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex items-center justify-center z-20">
              <SignupForm />
            </div>
            <div className="h-[300px] flex items-center justify-center p-4 z-20">
              <div className="w-[80vw] max-w-5xl h-full bg-white/80 backdrop-blur-md shadow-lg p-4 rounded-xl relative">
                <div className="absolute inset-2 border-2 border-gray-700 rounded-lg" />
                <div className="relative z-10 h-full overflow-auto flex items-center justify-center">
                  <ValidationMessage />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
} 