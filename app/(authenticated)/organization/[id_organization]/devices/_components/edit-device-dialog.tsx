import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IDeviceItem from "@/shared/models/devices/IDeviceItem";

interface EditDeviceDialogProps {
  device: IDeviceItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDeviceDialog({ device, isOpen, onClose, onSuccess }: EditDeviceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: device.name,
    model: device.model,
    location: device.location || "",
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/organizations/${device.organizationId}/devices`, {
        method: "PATCH",
        body: JSON.stringify({ id: device.id, ...formData }),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Dispositivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome do Dispositivo</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Input 
              value={formData.model} 
              onChange={(e) => setFormData({...formData, model: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Localização</Label>
            <Input 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}