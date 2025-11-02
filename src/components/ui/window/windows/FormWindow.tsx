/**
 * 폼 입력 전용 윈도우
 */

'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { PostFormInputs } from '@/components/post/PostFormInputs'
import { PostFormInputsProps } from '@/types/post'

interface FormWindowContentProps extends PostFormInputsProps {
  // PostFormInputs의 모든 props를 그대로 사용
}

export function FormWindowContent(props: FormWindowContentProps) {
  return (
    <div className="h-full overflow-auto bg-gray-50/80">
      <div className="p-6">
        <PostFormInputs {...props} />
      </div>
    </div>
  )
}

// 기본 아이콘
export const FormWindowIcon = () => <FileText size={14} />

