import { 
  Handshake, 
  Users, 
  UserRound, 
  MapPin
} from "lucide-react";

export const DELIVERY_OPTIONS = [
  {
    id: "negotiate",
    title: "Negociar Entrega",
    description: "Negocie valores e prazos com entregadores autônomos via WhatsApp.",
    icon: Handshake,
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    id: "partners",
    title: "Entregadores Parceiros",
    description: "Gerencie pedidos aceitos automaticamente por parceiros externos.",
    icon: Users,
    color: "bg-purple-500",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    id: "proprietary",
    title: "Entregadores Proprietários",
    description: "Acompanhe sua frota em tempo real com GPS e estatísticas de desempenho.",
    icon: UserRound,
    color: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600"
  },
  {
    id: "bulk_call",
    title: "Chamar na Localidade",
    description: "Envie uma chamada em massa para todos os entregadores da região.",
    icon: MapPin,
    color: "bg-orange-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600"
  }
];

export const MOCK_INTERNAL_DRIVERS: any[] = [];
