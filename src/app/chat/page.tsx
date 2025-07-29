"use client";

import { MessageSquare, Sparkles } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            <span className="gradient-text">All-AI</span>에 오신 것을 환영합니다
          </h2>
          <p className="text-muted-foreground">
            새로운 채팅을 시작하여 AI와 대화해보세요
          </p>
        </div>

        <div className="grid gap-3">
          <div className="p-4 rounded-lg border bg-card/50 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">지능형 모델 선택</h4>
                <p className="text-xs text-muted-foreground">
                  질문에 가장 적합한 AI 모델을 자동으로 선택합니다
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card/50 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">실시간 정보 검색</h4>
                <p className="text-xs text-muted-foreground">
                  최신 정보가 필요한 경우 자동으로 인터넷을 검색합니다
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card/50 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">명확한 의사소통</h4>
                <p className="text-xs text-muted-foreground">
                  모호한 질문은 명확히 하기 위해 추가 질문을 드립니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
