import Link from "next/link";
import { Activity, Server, LayoutDashboard, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Cabeçalho */}
      <header className="px-6 py-4 border-b border-background flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">Telemetria Industrial</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Recursos</Link>
          <Link href="/organization" className="text-muted-foreground hover:text-foreground transition-colors">Organizações</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Cadastrar
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Seção Hero */}
        <section className="py-20 md:py-32 px-6 text-center flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Monitoramento em Tempo Real via MQTT e WebSockets</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6">
            O Controle Total da sua Indústria na Palma da Mão
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Plataforma completa para recebimento, processamento e visualização de dados de CLPs. 
            Acompanhe telemetria, estados e alarmes em escala, com altíssima performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all text-lg">
              Acessar Dashboard
            </Link>
            <Link href="/organization" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-border text-lg">
              Ver Organizações
            </Link>
          </div>
        </section>

        {/* Seção de Funcionalidades */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos Pensados para Alta Performance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa arquitetura suporta um alto volume de eventos, garantindo que você visualize os dados dos seus dispositivos com baixa latência e segurança.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <Server className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Ingestão Rápida e em Lote</h3>
              <p className="text-muted-foreground">
                Uso de Cache (Redis) e comunicação MQTT otimizada para suportar picos de dados e persistência eficiente no banco.
              </p>
            </div>
            <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Visão em Tempo Real</h3>
              <p className="text-muted-foreground">
                Dashboards vivos atualizados via WebSocket permitindo acompanhamento instantâneo de telemetria e alarmes críticos.
              </p>
            </div>
            <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Gestão Inteligente</h3>
              <p className="text-muted-foreground">
                Separe os seus dispositivos por Organizações de forma lógica e segura, tendo o histórico e a auditoria sempre ao seu alcance.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t   py-8 px-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Sistema de Telemetria e Monitoramento Industrial. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
