import { Toast } from "./toast";

interface ToastContainerProps {
  success: string | null;
  error: string | null;
  onClearSuccess: () => void;
  onClearError: () => void;
}

export const ToastContainer = ({ success, error, onClearSuccess, onClearError }: ToastContainerProps) => (
  <>
    {success && <Toast message={success} onClose={onClearSuccess} />}
    {error && <Toast message={error} type="error" onClose={onClearError} />}
  </>
);
