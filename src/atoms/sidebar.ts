import { atom } from 'jotai';

// 사이드바 열림/닫힘 상태를 관리하는 atom
export const sidebarOpenAtom = atom<boolean>(false);

// 사이드바 너비를 관리하는 atom
export const sidebarWidthAtom = atom<number>(0);

// 사이드바가 Next.js 페이지인지 여부를 관리하는 atom
export const isNextPageAtom = atom<boolean>(false); 