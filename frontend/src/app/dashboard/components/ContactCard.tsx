import { useState } from "react";
import { Edit2, Trash, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserContact } from "@/types";
import { getContactIcon, getContactColor, getContactBadge } from "@/utils/contactHelpers";

interface ContactCardProps {
  contact: UserContact;
  isUpdating: boolean;
  onUpdate: (id: string, value: string) => void;
  onDelete: (id: string, type: string) => void;
}

export const ContactCard = ({ contact, isUpdating, onUpdate, onDelete }: ContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const Icon = getContactIcon(contact.type);
  const colors = getContactColor(contact.type);
  const badge = getContactBadge(contact.type);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(contact.value);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(contact.id, editValue.trim());
      setIsEditing(false);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border border-indigo-200 shadow-md px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Edit Contact</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Value</label>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Enter contact value"
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={!editValue.trim() || isUpdating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg px-4 py-2.5 text-sm font-medium"
            >
              {isUpdating ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Check size={16} className="mr-2" />
              )}
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" className="px-4 py-2.5 rounded-lg text-sm font-medium">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-l-4 hover:border-l-indigo-500 transition-all group">
      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={20} className={colors.text} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-gray-900 capitalize">{contact.type}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>{badge}</span>
        </div>
        <p className="text-sm text-gray-400 truncate max-w-xs">{contact.value}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          disabled={isUpdating}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {isUpdating ? (
            <Loader2 size={14} className="mr-1.5 animate-spin" />
          ) : (
            <Edit2 size={14} className="mr-1.5" />
          )}
          Edit
        </Button>
        <button
          onClick={() => onDelete(contact.id, contact.type)}
          disabled={isUpdating}
          className="text-gray-300 hover:text-red-400 transition-colors p-1.5 disabled:opacity-50"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
};
