interface DividerProps {
  text: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-neutral-200"></span>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 sm:px-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
