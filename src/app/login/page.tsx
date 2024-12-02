'use client'
import React from 'react';
import { useState } from 'react';

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 로그인 버튼 */}
      <button onClick={openModal} className="btn-primary">로그인</button>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {/* 로그인 폼 컨테이너 */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
              {/* 기존 로그인 폼 내용 */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 