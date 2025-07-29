"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="gradient-text text-2xl font-bold">AI</div>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to /chat
  }

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">All-AI</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => openAuth("signin")}>
                로그인
              </Button>
              <Button onClick={() => openAuth("signup")}>시작하기</Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              지능형 AI 라우팅 시스템
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              가장 <span className="gradient-text">적합한 AI</span>가<br />
              당신의 질문에 답합니다
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              더 이상 어떤 AI를 선택할지 고민하지 마세요. All-AI가 질문의 특성을
              분석하여 ChatGPT, Claude, Gemini 중 최적의 모델을 자동으로
              선택합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => openAuth("signup")}
              >
                무료로 시작하기
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                데모 보기
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="space-y-4 p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">지능형 모델 선택</h3>
                <p className="text-muted-foreground">
                  질문의 특성을 분석하여 코딩, 창작, 분석 등 각 분야에 가장
                  적합한 AI 모델을 자동 선택
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">실시간 정보 검색</h3>
                <p className="text-muted-foreground">
                  최신 정보가 필요한 질문은 자동으로 인터넷을 검색하여 정확하고
                  최신의 답변을 제공
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-xl bg-card border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">최적화된 성능</h3>
                <p className="text-muted-foreground">
                  빠른 응답 속도와 높은 정확도를 위해 각 상황에 맞는 최적의 AI
                  모델을 활용
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* How it Works */}
        <section className="container mx-auto px-4 py-20 border-t">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">어떻게 작동하나요?</h2>
              <p className="text-muted-foreground text-lg">
                간단한 3단계로 최고의 AI 답변을 받아보세요
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold">질문 입력</h3>
                <p className="text-muted-foreground">
                  궁금한 것을 자연스럽게 질문하세요
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold">AI 분석</h3>
                <p className="text-muted-foreground">
                  질문을 분석하여 최적의 AI 모델을 선택
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold">최적 답변</h3>
                <p className="text-muted-foreground">
                  가장 정확하고 유용한 답변을 받아보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8 bg-primary/5 rounded-2xl p-12">
            <h2 className="text-3xl font-bold">
              지금 바로 <span className="gradient-text">All-AI</span>를
              경험해보세요
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              어떤 AI 서비스를 구독할지 고민하지 마세요. All-AI 하나로 모든 AI의
              장점을 활용할 수 있습니다.
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => openAuth("signup")}
            >
              무료로 시작하기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">All-AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 All-AI. 모든 권리 보유.
            </p>
          </div>
        </footer>
      </div>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
