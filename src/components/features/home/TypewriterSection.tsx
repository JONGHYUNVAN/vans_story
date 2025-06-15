'use client';

import { useTypewriter } from '@/hooks/useTypewriter';
import TypewriterText from './TypewriterText';

export default function TypewriterSection() {
  const { text, style } = useTypewriter(['World!', 'Developer!', 'Everyone!']);
  
  return (
    <div className="w-full">
      <TypewriterText text={text} style={style} />
    </div>
  );
} 