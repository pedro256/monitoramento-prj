"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Mail, Lock, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import Link from "next/link";
import LoadingIco from "@/components/loading-ico";
import { signIn } from "next-auth/react"


const loginSchema = z.object({
  email: z.string().email("Protocolo de e-mail inválido"),
  password: z.string().min(8, "Credencial inválida"),
});

export default function TechLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true);

    await signIn("credentials", {
      email:values.email,
      password:values.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    // // Simulação de autenticação
    // setTimeout(() => {
    //   console.log("Autenticação solicitada:", values);
    //   setIsSubmitting(false);
    // }, 2000);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      <Card className="w-full max-w-lg bg-background border-border shadow-2xl z-10 backdrop-blur-sm">
        <CardHeader className="space-y-1 border-b border-background/50 pb-6">
          <CardTitle className="text-2xl font-bold text-text-secondary tracking-tight flex items-center gap-3">
            <LogIn className="w-6 h-6 text-primary" />
            Acesso ao Sistema
          </CardTitle>

          <p className="text-xs text-text-secondary">
            Informe suas credenciais para autenticação no sistema.
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-text-secondary uppercase">
                      E-mail
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />

                        <Input
                          type="email"
                          placeholder="enterprise@system.com.br"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>

                    <FormMessage className="text-[10px] text-destructive" />
                  </FormItem>
                )}
              />

              {/* SENHA */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-text-secondary uppercase">
                      Senha
                    </FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />

                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>

                    <FormMessage className="text-[10px] text-destructive" />
                  </FormItem>
                )}
              />

              {/* LINK ESQUECI SENHA */}
              <div className="flex justify-end text-xs">
                <Link
                  href="/auth/recovery"
                  className="text-link hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>

              {/* BOTÃO */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 bg-primary/75 hover:bg-primary text-text-primary hover:text-text-primary/25 font-bold uppercase tracking-widest transition-all duration-300",
                  isSubmitting && "opacity-50 cursor-not-allowed",
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 text-text-primary">
                    <div className="w-4 h-4">
                      <LoadingIco />
                    </div>
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-text-primary">
                    Acessar Sistema
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {/* LINK CADASTRO */}
              <div className="pt-4 flex justify-center items-center text-sm text-text-secondary gap-2">
                <div className="flex items-center gap-1">
                  Não possui acesso?
                </div>

                <Link className="text-link" href="/register">
                  Criar conta
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
