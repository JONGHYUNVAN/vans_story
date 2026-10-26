'use client';

import { FormProvider, useForm } from 'react-hook-form';
import BackgroundVideo from '@/app/signup/_components/BackgroundVideo';
import ValidationMessage from '@/app/signup/_components/ValidationMessage';
import SignupForm from '@/app/signup/_components/Form';

export default function SignupPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="fixed inset-0 h-screen w-screen overflow-hidden">
        <BackgroundVideo />
        <div className="absolute inset-0 z-10 bg-black/20">
          <div className="flex h-full w-full flex-col">
            <div className="z-20 flex flex-1 items-center justify-center">
              <SignupForm />
            </div>
            <div className="z-20 flex h-[300px] items-center justify-center p-4">
              <div className="relative h-full w-[80vw] max-w-5xl rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-md">
                <div className="absolute inset-2 rounded-lg border-2 border-gray-700" />
                <div className="relative z-10 flex h-full items-center justify-center overflow-auto">
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
