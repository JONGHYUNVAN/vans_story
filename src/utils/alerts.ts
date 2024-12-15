import Swal from 'sweetalert2';

export const showWelcomeAlert = (title: string) => {
    Swal.fire({
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: 1500
    });
};

export const showLogoutAlert = (title: string) => {
    Swal.fire({
        icon: 'info',
        title: title,
        showConfirmButton: false,
        timer: 1500
    });
};