
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AiModel {
  id: string;
  name: string;
  provider: string;
  specialization?: string;
}

interface AiSelectProps {
  models: AiModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const AiSelect = ({ models, selectedModel, onModelChange }: AiSelectProps) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        AI Model
      </label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an AI model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-gray-500">({model.provider})</span>
                {model.specialization && (
                  <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {model.specialization}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AiSelect;
