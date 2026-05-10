import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Shipment {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  status: "Pending" | "In Transit" | "Delivered" | "Delayed";
  priority: "Low" | "Medium" | "High";
  eta: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Accepted" | "Pending";
  invitedAt: string;
}

interface ShipmentState {
  shipments: Shipment[];
  teamMembers: TeamMember[];
  addShipment: (shipment: Omit<Shipment, "id" | "createdAt">) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  getShipment: (id: string) => Shipment | undefined;
  
  // Team actions
  addTeamMember: (member: Omit<TeamMember, "id" | "status" | "invitedAt">) => void;
  updateMemberStatus: (id: string, status: TeamMember["status"]) => void;
  removeMember: (id: string) => void;
}

const initialShipments: Shipment[] = [
  {
    id: "SH-7301",
    customer: "Acme Corp",
    origin: "Shanghai, CN",
    destination: "Los Angeles, US",
    status: "In Transit",
    priority: "High",
    eta: "2024-05-15",
    createdAt: "2024-05-08T10:00:00Z",
  },
  {
    id: "SH-7302",
    customer: "Global Tech",
    origin: "Berlin, DE",
    destination: "New York, US",
    status: "Delivered",
    priority: "Medium",
    eta: "2024-05-10",
    createdAt: "2024-05-05T08:00:00Z",
  },
];

const initialTeam: TeamMember[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Accepted", invitedAt: "2024-04-10T10:00:00Z" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Accepted", invitedAt: "2024-04-15T12:00:00Z" },
];

export const useShipments = create<ShipmentState>()(
  persist(
    (set, get) => ({
      shipments: initialShipments,
      teamMembers: initialTeam,
      addShipment: (shipment) => {
        const newShipment: Shipment = {
          ...shipment,
          id: `SH-${Math.floor(Math.random() * 9000) + 1000}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          shipments: [newShipment, ...state.shipments],
        }));
      },
      updateShipment: (id, updates) => {
        set((state) => ({
          shipments: state.shipments.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },
      deleteShipment: (id) => {
        set((state) => ({
          shipments: state.shipments.filter((s) => s.id !== id),
        }));
      },
      getShipment: (id) => {
        return get().shipments.find((s) => s.id === id);
      },

      addTeamMember: (member) => {
        const newMember: TeamMember = {
          ...member,
          id: Math.random().toString(36).substr(2, 9),
          status: "Pending",
          invitedAt: new Date().toISOString(),
        };
        set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
      },
      updateMemberStatus: (id, status) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        }));
      },
      removeMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        }));
      },
    }),
    {
      name: "neurolinkx-shipments",
    }
  )
);
