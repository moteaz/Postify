"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
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

interface LogoutConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function LogoutConfirmSheet({ isOpen, onClose, onConfirm }: LogoutConfirmSheetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-2 sm:gap-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-sm sm:text-lg text-left">Log out?</AlertDialogTitle>
              <AlertDialogDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-left">
                You'll need to sign in again to access Postify.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onClose} disabled={isLoading} className="w-full sm:w-auto h-9 sm:h-10 text-sm">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={isLoading}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Logging out…
              </>
            ) : (
              "Log out"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
