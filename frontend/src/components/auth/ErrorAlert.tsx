interface ErrorAlertProps {
  message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium text-center">
      {message}
    </div>
  );
}
