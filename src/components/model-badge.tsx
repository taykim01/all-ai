"use client";

import { Badge } from "@/components/ui/badge";
import { getModelInfo } from "@/lib/ai";
import type { AIModel } from "@/lib/ai";
import { Info } from "lucide-react";

interface ModelBadgeProps {
  model: AIModel;
  showDescription?: boolean;
  className?: string;
}

export function ModelBadge({ model, showDescription = false, className }: ModelBadgeProps) {
  const modelInfo = getModelInfo(model);
  
  const getCostColor = (costLevel: "low" | "medium" | "high") => {
    switch (costLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant="outline" 
        className={`${getCostColor(modelInfo.costLevel)} font-medium`}
      >
        <Info className="w-3 h-3 mr-1" />
        {modelInfo.name}
      </Badge>
      {showDescription && (
        <div className="text-xs text-muted-foreground max-w-xs">
          {modelInfo.description}
        </div>
      )}
    </div>
  );
}
