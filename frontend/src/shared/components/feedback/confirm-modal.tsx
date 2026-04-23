import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  onConfirm, 
  onCancel 
}: ConfirmModalProps) => {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-sm sm:text-lg text-left">{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-left">{message}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onCancel} className="w-full sm:w-auto h-9 sm:h-10 text-sm">{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-full sm:w-auto h-9 sm:h-10 text-sm bg-destructive hover:bg-destructive/90">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
