// utils/AlertService.ts
type ShowAlertProps = {
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

let showAlertFn: (props: ShowAlertProps) => void;
export const setAlertHandler = (fn: typeof showAlertFn) => {
  showAlertFn = fn;
};

export const AlertService = {
  show: (props: ShowAlertProps) => {
    if (showAlertFn) showAlertFn(props);
    else console.warn('CustomAlert not initialized yet');
  },
};