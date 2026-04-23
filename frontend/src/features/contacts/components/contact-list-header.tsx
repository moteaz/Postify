import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactListHeaderProps {
  onAdd: () => void;
}

export const ContactListHeader = ({ onAdd }: ContactListHeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mt-1">Add your contact details to create a tailored cover letter</p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm hover:scale-105 transition-transform"
        >
          <Plus size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>
      <div className="h-px bg-gray-200" />
    </div>
  );
};
