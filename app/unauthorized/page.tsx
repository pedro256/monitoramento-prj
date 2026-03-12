"use client";
import React from "react";
import { ShieldAlert, ArrowLeft, Lock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Ícone com Alerta Visual */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full scale-150" />
          <div className="relative bg-card border-2 border-destructive rounded-full p-5 rounded-radius shadow-sm">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          {/* <div className="absolute -top-1 -right-1 bg-destructive text-white p-2 rounded-full border-2 border-background">
            <ShieldAlert size={14} />
          </div> */}
        </div>

        {/* Mensagem Principal */}
        <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-3">
          Acesso Restrito
        </h1>
        <p className="text-muted-foreground text-base mb-10 leading-relaxed">
          Ops! Você não tem as permissões necessárias para acessar este recurso.
          Certifique-se de estar logado com a conta correta ou entre em contato
          com o suporte.
        </p>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          <Button
            // variant="ghost"
            onClick={() => router.push("/")}
            className="w-full h-12 bg-primary-900 hover:bg-primary-700  text-primary-foreground font-bold rounded-radius flex items-center justify-center gap-2 transition-all"
          >
            <Home size={18} />
            Ir para a Home
          </Button>
        </div>

        {/* Rodapé de Ajuda */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground opacity-50">
            Identificador do Erro: 403_UNAUTHORIZED_ACCESS
          </p>
        </div>
      </div>
    </main>
  );
}
