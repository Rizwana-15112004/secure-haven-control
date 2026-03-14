import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SYSTEM_INSTRUCTION = `You are the Secure Haven AI Assistant — a smart home and security control assistant. 
Help users with home security, automation, occupant management, and system status.
Answer any question accurately and concisely. Use markdown for formatting.`;

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'Secure Haven system online. How can I assist you with your home control today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Hold a reference to the AI client (not model), created lazily
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const getClient = (): GoogleGenAI | null => {
    if (aiRef.current) return aiRef.current;

    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!rawKey || typeof rawKey !== 'string' || rawKey.trim() === '' || rawKey.includes('your_key_here')) {
      return null;
    }

    try {
      const key = rawKey.trim().replace(/^["']|["']$/g, '');
      aiRef.current = new GoogleGenAI({ apiKey: key });
      return aiRef.current;
    } catch (err) {
      console.error("[AI] Init failed:", err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const updatedMessages: Message[] = [...messages, { id: Date.now().toString(), role: 'user', content: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const ai = getClient();
    if (!ai) {
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: 'model',
        content: '### 🛡️ AI Setup Required\n\nYour Gemini API Key is missing or invalid.\n\n1. Add `VITE_GEMINI_API_KEY=your_key` to your `.env` file.\n2. **Restart the dev server** completely (`Ctrl+C` then `npm run dev`).\n3. Refresh this page.',
      }]);
      setIsLoading(false);
      return;
    }

    try {
      // Build history (exclude the last user message since we send it separately)
      const history = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const chat = ai.chats.create({
        model: 'gemini-2.0-flash-lite',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history,
      });

      const response = await chat.sendMessage({ message: userText });
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: 'model',
        content: response.text ?? "I couldn't process that. Please try again.",
      }]);
    } catch (error: any) {
      console.error("[AI] Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(),
        role: 'model',
        content: `Error: ${error?.message ?? 'Something went wrong. Please check your API key.'}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.3)] z-50 bg-primary hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
        size="icon"
      >
        <Bot className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
        </span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] shadow-2xl flex flex-col z-50 backdrop-blur-xl bg-background/95 border-primary/20 overflow-hidden animate-in slide-in-from-bottom-5">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-primary/5">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span>Secure Haven AI</span>
            <span className="text-[10px] text-muted-foreground font-normal uppercase tracking-widest">Active</span>
          </div>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${msg.role === 'user' ? 'bg-primary text-white border-primary/50' : 'bg-secondary border-border'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-accent" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] shadow-sm leading-relaxed prose prose-invert prose-p:my-0 prose-pre:my-2 prose-sm ${msg.role === 'user' ? 'bg-primary/90 text-white rounded-tr-sm' : 'bg-secondary/50 backdrop-blur-sm rounded-tl-sm border border-border/50'}`}>
                  {msg.role === 'model' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary border border-border">
                  <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-secondary/50 border border-border/50 flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background/50">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Secure Haven AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="rounded-xl flex-1 bg-secondary/30 border-primary/10"
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="rounded-xl">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-center mt-2 text-muted-foreground">AI can make mistakes. Check important info.</p>
        </div>
      </CardContent>
    </Card>
  );
}
