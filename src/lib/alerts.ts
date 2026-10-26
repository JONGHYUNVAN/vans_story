import Swal from 'sweetalert2';

/**
 * 일반 알림을 표시하는 함수
 * @param {string} title - 알림의 제목
 * @param {string} text - 알림의 내용 (선택사항)
 * @param {'success' | 'error' | 'warning' | 'info'} icon - 알림 아이콘
 */
export const showAlert = (title: string, text?: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: true,
        timer: icon === 'success' ? 2000 : undefined
    });
};

/**
 * 환영 알림을 표시하는 함수
 * @param {string} title - 알림의 제목
 * @description 
 * 사용자가 로그인했을 때 환영 메시지를 표시합니다. 
 * 1. 성공 아이콘과 함께 제목을 표시합니다.
 * 2. 확인 버튼 없이 1.5초 후 자동으로 사라집니다.
 */
export const showWelcomeAlert = (title: string) => {
    Swal.fire({
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: 1500
    });
};

/**
 * 로그아웃 알림을 표시하는 함수
 * @param {string} title - 알림의 제목
 * @description 
 * 사용자가 로그아웃했을 때 로그아웃 메시지를 표시합니다. 
 * 1. 정보 아이콘과 함께 제목을 표시합니다.
 * 2. 확인 버튼 없이 1.5초 후 자동으로 사라집니다.
 */
export const showLogoutAlert = (title: string) => {
    Swal.fire({
        icon: 'info',
        title: title,
        showConfirmButton: false,
        timer: 1500
    });
};