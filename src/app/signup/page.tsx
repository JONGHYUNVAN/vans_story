'use client';

import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import BackgroundVideo from './BackgroundVideo';
import ValidationMessage from './ValidationMessage';
import SignupForm from '../signup/SignupForm'; 

export default function SignupPage() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <div className="h-[65vh] relative overflow-hidden">
          <BackgroundVideo />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <SignupForm />
          </div>
        </div>
        <div className="relative h-[35vh] overflow-hidden">
          <div className="grid-background absolute -inset-[100%] -top-[150%] scale-[3]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-[80vw] max-w-5xl h-[25vh] max-h-3xl bg-white/80 backdrop-blur-md shadow-lg p-8 rounded-xl"
            >
              <div className="absolute inset-5 border-2 border-gray-700 rounded-lg" />
              <ValidationMessage />
            </motion.div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
} 