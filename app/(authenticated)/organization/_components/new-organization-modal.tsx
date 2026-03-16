'use client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import LoadingIco from "@/components/loading-ico";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";

const orgSchema = z.object({
  name: z.string().min(3, "Nome da organização deve ter ao menos 3 caracteres"),
  email: z.string().email("E-mail corporativo inválido"),
});

type OrgFormValues = z.infer<typeof orgSchema>;

export default function NewOrganizationModal() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<OrgFormValues>({
        resolver: zodResolver(orgSchema),
        defaultValues: { name: "", email: "" },
    });

    async function onSubmit(values: OrgFormValues) {
        setIsSubmitting(true);
        // Simulando POST para /api/organizations
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const newOrg = { id: Math.random().toString(), ...values };
            // setOrganizations([...organizations, newOrg]);
            setIsDialogOpen(false);
            form.reset();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/80 text-background font-bold gap-2">
                    <Plus className="w-4 h-4" /> Nova Organização
                </Button>
            </DialogTrigger>
            <DialogContent className="border-border text-text-primary">
                <DialogHeader>
                    <DialogTitle>Provisionar Organização</DialogTitle>
                    <DialogDescription className="text-text-secondary">
                        Insira os dados da nova entidade para monitoramento.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-[10px]">Nome da Empresa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Matriz Setor Norte" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-[10px]">E-mail de Contato</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                                            <Input className="pl-10" placeholder="org@empresa.com" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                            {isSubmitting ? <LoadingIco /> : "Confirmar Uplink"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}