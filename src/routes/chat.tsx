import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat — Medallo Express" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { messages, sendMessage, role } = useApp();
  const [text, setText] = useState("");

  function send() {
    const t = text.trim();
    if (!t) return;
    sendMessage({ from: role, text: t });
    setText("");
    setTimeout(() => {
      sendMessage({
        from: role === "cliente" ? "conductor" : "cliente",
        text:
          role === "cliente"
            ? "¡Voy en camino! Llego en 3 minutos."
            : "Perfecto, te espero en la entrada principal.",
      });
    }, 1200);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col px-4 py-4 pb-28">
        <h1 className="mb-3 text-2xl font-bold tracking-tight">Chat</h1>
        <div className="mb-3 rounded-2xl border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
          Hablando como <span className="font-semibold text-neon">{role}</span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto rounded-2xl border border-border bg-card/60 p-3">
          {messages.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Sin mensajes todavía. Escribe el primero.
            </p>
          )}
          {messages.map((m) => {
            const mine = m.from === role;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                    mine ? "bg-neon-gradient text-neon-foreground" : "bg-secondary"
                  )}
                >
                  {m.text}
                  <div className="mt-1 text-[10px] opacity-70">
                    {new Date(m.at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Escribe un mensaje…"
            className="h-12 rounded-xl bg-input"
          />
          <Button onClick={send} className="h-12 w-12 bg-neon-gradient p-0 text-neon-foreground shadow-neon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
