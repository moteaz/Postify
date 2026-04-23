// Shared Layout Components
export { Sidebar } from './components/layout/sidebar';
export { DashboardHeader } from './components/layout/dashboard-header';
export { LogoutConfirmSheet } from './components/layout/logout-confirm-sheet';

// Shared Feedback Components
export { Toast } from './components/feedback/toast';
export { ToastContainer } from './components/feedback/toast-container';
export { Pagination } from './components/feedback/pagination';
export { ConfirmModal } from './components/feedback/confirm-modal';

// Shared Hooks
export { useAutoReset } from './hooks/use-auto-reset';
export { useFocusTrap } from './hooks/use-focus-trap';
export { useScrollReveal } from './hooks/use-scroll-reveal';
export { usePermissions } from './hooks/use-permissions';

// Shared Utils
export { handleApiError } from './utils/error-handler';
export { truncateFilename, formatFileSize } from './utils/file-utils';
export { getContactIcon, getContactColor, getContactBadge } from './utils/contact-helpers';
