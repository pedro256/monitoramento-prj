"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserPlus,
  ShieldCheck,
  Mail,
  Lock,
  Fingerprint,
  Clock,
  ChevronRight,
} from "lucide-react";

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
import { useRouter } from "next/navigation";
const registerSchema = z
  .object({
    name: z.string().min(2, "Identificação mínima requerida"),
    email: z.string().email("Protocolo de e-mail inválido"),
    password: z.string().min(8, "Segurança mínima: 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Divergência de chaves detectada",
    path: ["confirmPassword"],
  });

export default function TechRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    // Simulando uplink de dados
    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    }).finally(()=>{
       setIsSubmitting(false);
       route.push("/auth")
    }).catch((e)=>{
      console.error("error: ",e)
    })

    // setTimeout(() => {
    //   console.log("Credenciais transmitidas:", values);
    //   setIsSubmitting(false);
    // }, 2000);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      <Card className="w-full max-w-lg bg-background border-border shadow-2xl z-10 backdrop-blur-sm">
        <CardHeader className="space-y-1 border-b border-background/50 pb-6">
          <CardTitle className="text-2xl font-bold text-text-secondary tracking-tight flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" />
            Registro de Novo Usuário
          </CardTitle>
          <p className="text-xs text-text-secondary ">
            Inicie o provisionamento de credenciais para acesso ao sistema.
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-text-secondary  uppercase">
                      Identificação (Nome)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome Empresa"
                        {...field}
                        className=" text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px]  text-text-secondary  uppercase">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4  text-text-secondary" />
                        <Input
                          type="email"
                          placeholder="interprise@system.com.br"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] text-destructive" />
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
                      <FormLabel className="text-[10px]  text-text-secondary  uppercase">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4  text-text-secondary" />
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

                {/* Confirmar Senha */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] text-text-secondary  uppercase">
                        confirmar senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
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
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 bg-primary/75 hover:bg-primary text-text-primary hover:text-text-primary/25  font-bold uppercase tracking-widest transition-all duration-300",
                  isSubmitting && "opacity-50 cursor-not-allowed",
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 text-text-primary">
                    <div className="w-4 h-4">
                      <LoadingIco />
                    </div>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-text-primary">
                    Finalizar Cadastro <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="pt-4 flex justify-center items-center text-sm text-text-secondary gap-2">
                <div className="flex items-center gap-1">Ja tem Cadastro?</div>{" "}
                <Link className="text-link" href="/auth">
                  Acesse Aqui!
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
