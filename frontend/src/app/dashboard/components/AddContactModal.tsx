import { useState } from "react";
import { X, Globe, Mail, Phone, Linkedin, Github, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddContactModalProps {
  onClose: () => void;
  onAdd: (type: string, value: string) => void;
}

type ContactType = "email" | "phone" | "linkedin" | "github" | "website" | "custom";

interface ContactTypeOption {
  value: ContactType;
  label: string;
  icon: typeof Globe;
  placeholder: string;
}

const CONTACT_TYPES: ContactTypeOption[] = [
  { value: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
  { value: "phone", label: "Phone", icon: Phone, placeholder: "+1 (555) 123-4567" },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
  { value: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
  { value: "website", label: "Website", icon: Globe, placeholder: "https://example.com" },
  { value: "custom", label: "Custom", icon: Link2, placeholder: "Enter custom value" },
];

export const AddContactModal = ({ onClose, onAdd }: AddContactModalProps) => {
  const [selectedType, setSelectedType] = useState<ContactType>("email");
  const [customType, setCustomType] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = selectedType === "custom" ? customType.trim() : selectedType;
    if (finalType && value.trim()) {
      onAdd(finalType, value.trim());
    }
  };

  const selectedOption = CONTACT_TYPES.find(t => t.value === selectedType) || CONTACT_TYPES[0];
  const Icon = selectedOption.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add New Contact</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Contact Type</label>
            <div className="grid grid-cols-3 gap-2">
              {CONTACT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${
                    selectedType === type.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <type.icon size={16} />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Type Input */}
          {selectedType === "custom" && (
            <div>
              <label htmlFor="custom-type" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Type Name
              </label>
              <Input
                id="custom-type"
                type="text"
                placeholder="e.g., Portfolio, Twitter, Discord"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {/* Value Input */}
          <div>
            <label htmlFor="contact-value" className="block text-sm font-medium text-gray-700 mb-2">
              {selectedType === "custom" ? "Contact Value" : `${selectedOption.label} Address`}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={16} />
              </div>
              <Input
                id="contact-value"
                type="text"
                placeholder={selectedOption.placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-10"
                autoFocus={selectedType !== "custom"}
              />
            </div>
            {(selectedType === "linkedin" || selectedType === "github" || selectedType === "website") && value && (
              <div className="mt-2 bg-indigo-50 text-indigo-700 text-xs rounded-lg px-3 py-2 flex items-center gap-2">
                <Globe size={12} />
                <span className="truncate">{value}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !value.trim() || (selectedType === "custom" && !customType.trim())
              }
              className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:bg-gray-300"
            >
              Add Contact
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};