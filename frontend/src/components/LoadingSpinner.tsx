export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F4]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#7C9EE8]/30 border-t-[#7C9EE8] rounded-full animate-spin" />
        <p className="text-sm text-[#78716C]">Loading...</p>
      </div>
    </div>
  );
}
