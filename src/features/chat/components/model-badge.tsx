"use client";

import { Badge } from "@/components/ui/badge";
import { getModelInfo } from "@/infrastructure/ai";
import type { AIModel } from "@/core/types/ai.types";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelBadgeProps {
  model: AIModel;
  showDescription?: boolean;
  className?: string;
}

export function ModelBadge({
  model,
  showDescription = false,
  className,
}: ModelBadgeProps) {
  const modelInfo = getModelInfo(model);

  const getModelColors = (model: AIModel) => {
    if (
      model.includes("gpt") ||
      model === "o1" ||
      model === "o3" ||
      model === "o3-pro" ||
      model === "o4-mini"
    ) {
      return "bg-model-gpt/20 text-model-gpt border-model-gpt/30";
    } else if (model.includes("claude")) {
      return "bg-model-claude/20 text-model-claude border-model-claude/30";
    } else if (model.includes("gemini")) {
      return "bg-model-gemini/20 text-model-gemini border-model-gemini/30";
    } else if (model.includes("grok")) {
      return "bg-model-grok/20 text-model-grok border-model-grok/30";
    } else {
      return "bg-secondary/20 text-secondary border-secondary/30";
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn(
          "backdrop-blur-sm font-medium text-xs py-0.5",
          getModelColors(model)
        )}
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
