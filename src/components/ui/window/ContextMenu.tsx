/**
 * Windows 11 스타일 컨텍스트 메뉴
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  isOpen: boolean;
}

export function ContextMenu({ items, position, onClose, isOpen }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // 메뉴가 화면 밖으로 나가지 않도록 위치 조정
  useEffect(() => {
    if (!menuRef.current || !isOpen) return;

    const menu = menuRef.current;
    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    // 오른쪽 경계 체크
    if (x + menuRect.width > windowWidth) {
      x = windowWidth - menuRect.width - 10;
    }

    // 하단 경계 체크
    if (y + menuRect.height > windowHeight) {
      y = windowHeight - menuRect.height - 10;
    }

    // 왼쪽/상단 최소값
    x = Math.max(10, x);
    y = Math.max(10, y);

    setAdjustedPosition({ x, y });
  }, [position, isOpen]);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Escape 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') return null;

  const menuContent = (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        className="fixed z-[10000] min-w-[200px] max-w-[300px]"
        style={{
          left: `${adjustedPosition.x}px`,
          top: `${adjustedPosition.y}px`,
        }}
      >
        <div className="overflow-hidden rounded-lg border border-gray-700/50 bg-[#2b2b2b]/95 py-1 shadow-2xl backdrop-blur-xl">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.separator ? (
                <div className="my-1 h-px bg-gray-700/50" />
              ) : (
                <button
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      onClose();
                    }
                  }}
                  disabled={item.disabled}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors duration-100 ${
                    item.disabled
                      ? 'cursor-not-allowed text-gray-500'
                      : item.danger
                        ? 'text-red-400 hover:bg-red-600/20'
                        : 'text-white hover:bg-white/10'
                  } `}
                >
                  {item.icon && (
                    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                      {item.icon}
                    </div>
                  )}
                  <span className="flex-1">{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(menuContent, document.body);
}

/**
 * 컨텍스트 메뉴 Hook
 */
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [items, setItems] = useState<ContextMenuItem[]>([]);

  const open = (x: number, y: number, menuItems: ContextMenuItem[]) => {
    setPosition({ x, y });
    setItems(menuItems);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleContextMenu = (e: React.MouseEvent, menuItems: ContextMenuItem[]) => {
    e.preventDefault();
    open(e.clientX, e.clientY, menuItems);
  };

  return {
    isOpen,
    position,
    items,
    open,
    close,
    handleContextMenu,
  };
}
