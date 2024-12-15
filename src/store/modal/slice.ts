import { createSlice } from '@reduxjs/toolkit';

/**
 * 모달 상태 인터페이스
 * @interface ModalState
 * @property {boolean} isLoginModalOpen - 로그인 모달의 열림 상태
 */
interface ModalState {
  isLoginModalOpen: boolean;
}

/**
 * 모달 상태 초기값
 * @type {ModalState}
 */
const initialState: ModalState = {
  isLoginModalOpen: false,
};

/**
 * 모달 관련 Redux Slice
 * @description 로그인 모달의 열림/닫힘 상태를 관리하는 Redux Slice
 */
export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /**
     * 로그인 모달 열기
     * @param {ModalState} state - 현재 모달 상태
     * @returns {void}
     */
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },

    /**
     * 로그인 모달 닫기
     * @param {ModalState} state - 현재 모달 상태
     * @returns {void}
     */
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

// 액션 생성자 내보내기
export const { openLoginModal, closeLoginModal } = modalSlice.actions;

// 리듀서 내보내기
export default modalSlice.reducer; 