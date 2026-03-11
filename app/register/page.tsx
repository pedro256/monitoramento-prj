'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Fingerprint, 
  Clock,
  ChevronRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, "Identificação mínima requerida"),
  email: z.string().email("Protocolo de e-mail inválido"),
  password: z.string().min(8, "Segurança mínima: 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Divergência de chaves detectada",
  path: ["confirmPassword"],
});

export default function TechRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    // Simulando uplink de dados
    setTimeout(() => {
      console.log("Credenciais transmitidas:", values);
      setIsSubmitting(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">

      <Card className="w-full max-w-lg bg-background border-border shadow-2xl z-10 backdrop-blur-sm">
        
        <CardHeader className="space-y-1 border-b border-gray-800/50 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" />
            Registro de Novo Operador
          </CardTitle>
          <p className="text-xs text-gray-500 ">Inicie o provisionamento de credenciais para acesso ao sistema.</p>
        </CardHeader>

        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] text-text-secondary  uppercase">Identificação (Nome)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome Empresa" 
                          {...field} 
                          className="bg-black/40 border-gray-800 focus:border-emerald-500/50 focus:ring-0 text-gray-200 placeholder:text-gray-700 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Data Criado (Campo de Visualização) */}
                <FormItem>
                  <FormLabel className="text-[10px] text-text-secondary uppercase">Data de Registro</FormLabel>
                  <div className="h-10 px-3 flex items-center bg-gray-900/20 border border-gray-800/40 rounded-md text-xs text-gray-600 ">
                    {new Date().toLocaleDateString()}
                  </div>
                </FormItem>
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-gray-500 uppercase">Protocolo de Comunicação (E-mail)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                        <Input 
                          type="email" 
                          placeholder="protocolo@ind.system" 
                          {...field} 
                          className="pl-10 bg-black/40 border-gray-800 focus:border-emerald-500/50 text-gray-200 text-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] text-gray-500 uppercase">Chave de Acesso</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10 bg-black/40 border-gray-800 focus:border-emerald-500/50 text-gray-200 text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Confirmar Senha */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] text-gray-500 uppercase">Verificação de Chave</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10 bg-black/40 border-gray-800 focus:border-emerald-500/50 text-gray-200 text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold uppercase tracking-widest transition-all duration-300",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitindo...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Finalizar Cadastro <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="pt-4 flex justify-center items-center text-[8px] text-gray-600 tracking-[0.2em]">
                <div className="flex items-center gap-1">
                  Não tem Cadastro? 
                </div>
                <span>Terminal ID: {Math.random().toString(16).substring(2, 8).toUpperCase()}</span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}