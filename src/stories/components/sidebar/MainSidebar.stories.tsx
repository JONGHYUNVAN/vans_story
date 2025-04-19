import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React, { useState } from 'react';
import { SiNestjs, SiSpring, SiMariadb, SiMongodb, SiNextdotjs, 
         SiDocker, SiJest, SiCypress, SiGit, SiJunit5 } from "react-icons/si";
import { TbBinaryTree2 } from "react-icons/tb";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";

// 실제 MainSidebar 컴포넌트와 비슷한 디자인의 목업 컴포넌트
const MockedMainSidebar = () => {
  // isOpen 상태 추가
  const [isOpen, setIsOpen] = useState(false);
  
  // 간략화된 카테고리 데이터
  const categories = {
    'Frontend': [
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' }
    ],
    'Backend': [
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'Spring', icon: SiSpring, color: '#6DB33F' }
    ],
    'Database': [
      { name: 'MariaDB', icon: SiMariadb, color: '#003545' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' }
    ],
    'IT': [
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'JWT', icon: RiShieldKeyholeLine, color: '#00B4CC' }
    ],
    'Test': [
      { name: 'Jest', icon: SiJest, color: '#C21325' },
      { name: 'Cypress', icon: SiCypress, color: '#17202C' },
      { name: 'JUnit5', icon: SiJunit5, color: '#25A162' }
    ],
    'Etc': [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Algorithm', icon: TbBinaryTree2, color: '#4CAF50' }
    ]
  };

  return (
    <Provider store={store}>
      <div 
        className={`${isOpen ? 'w-64' : 'w-16'} h-full transition-all duration-300 fixed left-0 top-0 z-[30]`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* 사이드바 미리보기 영역 - 마우스가 올라가지 않았을 때 보이는 부분 */}
        <div className={`
          absolute left-0 top-0 h-full w-16
          flex items-center justify-center
          bg-transparent backdrop-blur-sm rounded-r-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}>
          <div className="flex flex-col items-center gap-2">
            <span className="ml-2 text-lg font-bold text-gray-300 font-handwriting writing-vertical">
              사이드바 메뉴
            </span>
          </div>
          <MdKeyboardArrowRight className="w-5 h-5 text-gray-300 animate-pulse" />
        </div>

        {/* 사이드바 본체 - 마우스가 올라갔을 때 보이는 부분 */}
        <div className={`
          absolute top-0 left-0 w-64 h-full
          bg-white/80 backdrop-blur-md shadow-lg rounded-r-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : '-translate-x-64 opacity-0 pointer-events-none'
          }
        `}>
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
              {/* 이미지 경로 수정 */}
              <SiNextdotjs className="w-6 h-6" />
              Van's Dev Blog
            </div>
          </div>
          
          <nav className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                  {category}
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
                        <item.icon 
                          className="w-5 h-5 text-gray-400"
                          style={{ color: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </Provider>
  );
};

const meta: Meta<typeof MockedMainSidebar> = {
  title: 'stories/components/sidebar/MainSidebar',
  component: MockedMainSidebar,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MockedMainSidebar>;

export const Default: Story = {}; 