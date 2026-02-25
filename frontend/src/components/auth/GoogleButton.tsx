interface GoogleButtonProps {
  onClick: () => void;
  text: string;
}

export default function GoogleButton({ onClick, text }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 sm:h-12 flex items-center justify-center gap-3 bg-white text-neutral-900 rounded-lg sm:rounded-xl font-semibold shadow-sm hover:shadow-md transition-all border border-neutral-300 hover:border-neutral-400 text-sm sm:text-base"
    >
      <img
        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
        alt="Google"
        className="w-5 h-5"
      />
      {text}
    </button>
  );
}
