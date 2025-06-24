import { toast } from 'react-toastify';

const notifySuccess = (message: string) =>
  toast.success(message, {
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true, 
    draggable: true,
    progress: undefined,
  });

const notifyError = (message: string) =>
  toast.error(message, {
    position: 'bottom-center',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export { notifySuccess, notifyError };

