import { Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactListEmptyProps {
  onAdd: () => void;
}

export const ContactListEmpty = ({ onAdd }: ContactListEmptyProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Link2 size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No contacts yet</h3>
      <p className="text-sm text-gray-500 mb-6">Add your first contact to get started</p>
      <Button
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium shadow-sm hover:scale-105 transition-transform"
      >
        <Plus size={16} className="mr-2" />
        Add Contact
      </Button>
    </div>
  );
};
