import { Button } from "@/components/ui/button";

interface GoogleButtonProps {
  onClick: () => void;
  text: string;
}

export default function GoogleButton({ onClick, text }: GoogleButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full h-11 sm:h-12 gap-3 text-sm sm:text-base"
    >
      <img
        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
        alt="Google"
        className="w-5 h-5"
      />
      {text}
    </Button>
  );
}
