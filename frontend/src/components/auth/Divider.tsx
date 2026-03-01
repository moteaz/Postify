interface DividerProps {
  text: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border"></span>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-3 sm:px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
