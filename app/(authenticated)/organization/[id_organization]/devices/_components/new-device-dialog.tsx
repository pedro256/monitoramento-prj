"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { da } from "date-fns/locale";


const deviceSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  model: z.string().min(2, "Informe um modelo válido"),
});
type DeviceFormData = z.infer<typeof deviceSchema>;


export default function NewDeviceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const idOrganization = params.id_organization;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: DeviceFormData) => {
    setIsLoading(true);

    fetch(`/api/organizations/${idOrganization}/devices`,{
      method:'POST',
      body:JSON.stringify({
        name: data.name,
        model: data.model
      })
    })
    
    console.log("Enviando dados:", data);
    
    try {
      
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(val) => {
      setIsDialogOpen(val);
      if (!val) reset(); // Limpa ao fechar
    }}>
      <DialogTrigger asChild>
        <Button className="bg-primary-900">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Máquina
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Adicionar Nova Máquina
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os dados da nova máquina que será integrada ao sistema
          </DialogDescription>
        </DialogHeader>

        {/* 4. Envolva os campos em um form para o handleSubmit funcionar */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Nome da Máquina
            </Label>
            <Input
              id="name"
              {...register("name")} // Registro do campo
              placeholder="Ex: Prensa Hidráulica 05"
              className={`bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-500 ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-300">
              Modelo
            </Label>
            <Input
              id="model"
              {...register("model")} // Registro do campo
              placeholder="Ex: PH-3000X"
              className={`bg-gray-800 border-gray-700 text-gray-100 focus:border-emerald-500 ${
                errors.model ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.model && (
              <p className="text-xs text-red-500">{errors.model.message}</p>
            )}
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-sm text-cyan-400">
            Um token de API será gerado automaticamente.
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-800 border-gray-700 text-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white min-w-[140px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Adicionar Máquina"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}