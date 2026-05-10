"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Anchor,
  Ship,
  MoreVertical,
  Printer,
  Edit,
  History,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useShipments } from "@/lib/shipments";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { getShipment, updateShipment } = useShipments();
  const shipment = getShipment(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
    customer: shipment?.customer || "",
    status: shipment?.status || "Pending",
    priority: shipment?.priority || "Medium",
  });

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-xl font-semibold">Shipment not found</p>
        <Button onClick={() => router.push("/dashboard/shipments")}>
          Back to Shipments
        </Button>
      </div>
    );
  }

  // Generate tracking history with 2-day gaps
  const trackingHistory = [
    {
      status: "Picked Up",
      location: shipment.origin,
      date: new Date(shipment.createdAt),
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      completed: true,
    },
    {
      status: "In Transit",
      location: "International Hub",
      date: addDays(new Date(shipment.createdAt), 2),
      icon: Ship,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      completed: shipment.status !== "Pending",
    },
    {
      status: "Customs Cleared",
      location: "Port of Entry",
      date: addDays(new Date(shipment.createdAt), 4),
      icon: History,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      completed: shipment.status === "Delivered",
    },
    {
      status: "Out for Delivery",
      location: "Local Distribution Center",
      date: addDays(new Date(shipment.createdAt), 6),
      icon: Truck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      completed: shipment.status === "Delivered",
    },
    {
      status: "Delivered",
      location: shipment.destination,
      date: addDays(new Date(shipment.createdAt), 8),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      completed: shipment.status === "Delivered",
    },
  ];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    updateShipment(shipment.id, editData as any);
    setIsSubmitting(false);
    setIsEditOpen(false);
    toast({
      title: "Success",
      description: "Shipment details updated successfully.",
    });
  };

  const handlePrint = () => {
    setIsPrintOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">{shipment.id}</h2>
            <Badge variant={getStatusVariant(shipment.status)}>{shipment.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            From {shipment.origin} to {shipment.destination}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Label
          </Button>
          <Button onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Details
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Map & Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[450px] w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                {/* Google Maps Integration Placeholder */}
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${encodeURIComponent(shipment.origin)}&destination=${encodeURIComponent(shipment.destination)}&mode=shipping`}
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-md border shadow-sm text-xs space-y-1 z-10">
                  <p className="font-bold flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-primary" /> Current Position
                  </p>
                  <p className="text-muted-foreground">Lat: 34.0522, Lng: -118.2437</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" /> Origin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="font-bold">{shipment.origin}</p>
                <p className="text-sm text-muted-foreground">Logistics Hub A, Industrial Zone</p>
                <p className="text-sm pt-2">Scan Time: {format(new Date(shipment.createdAt), "PPP p")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" /> Destination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="font-bold">{shipment.destination}</p>
                <p className="text-sm text-muted-foreground">Final Delivery Terminal</p>
                <p className="text-sm pt-2">ETA: {format(new Date(shipment.eta), "PPP")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Tracking History */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" /> Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                {trackingHistory.map((event, index) => {
                  const Icon = event.icon;
                  const isCurrent = (shipment.status === event.status) || 
                                   (index === 1 && shipment.status === "In Transit") ||
                                   (index === 0 && shipment.status === "Pending");
                  
                  return (
                    <motion.div
                      key={event.status}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className={cn(
                        "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border bg-background z-10 transition-all duration-300",
                        event.completed ? cn("border-transparent", event.bg, event.color) : "border-muted text-muted-foreground",
                        isCurrent && "ring-4 ring-primary/20 scale-110"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm font-bold",
                          event.completed ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {event.status}
                        </span>
                        <span className="text-xs text-muted-foreground">{event.location}</span>
                        <span className="text-[10px] font-mono mt-1 text-primary">
                          {format(event.date, "MMM dd, yyyy")}
                        </span>
                        {isCurrent && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-600 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full w-fit">
                            <AlertTriangle className="h-3 w-3" /> CURRENT STAGE
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Shipment Details</DialogTitle>
              <DialogDescription>Modify the current status and priority of the shipment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Current Status</Label>
                <select
                  id="status"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                <select
                  id="priority"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={editData.priority}
                  onChange={(e) => setEditData({...editData, priority: e.target.value as any})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting}>Update Details</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Print Modal */}
      <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shipping Label</DialogTitle>
            <DialogDescription>Ready for printing on standard 4x6 label paper.</DialogDescription>
          </DialogHeader>
          <div id="shipping-label" className="border-4 border-black p-6 bg-white text-black font-mono space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-bold">NEUROLINKX</p>
                <p className="text-xs uppercase">Express Shipping Division</p>
              </div>
              <div className="h-16 w-16 bg-black flex items-center justify-center text-white font-bold text-xs">
                LABEL<br/>ID: {shipment.id.split('-')[1]}
              </div>
            </div>
            
            <div className="border-y-2 border-black py-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold">FROM:</p>
                <p className="text-xs">{shipment.origin}</p>
                <p className="text-[10px] mt-2">SHIP DATE: {format(new Date(shipment.createdAt), "dd-MMM-yy")}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold">TO:</p>
                <p className="text-xs font-bold underline">{shipment.customer}</p>
                <p className="text-xs">{shipment.destination}</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <div className="h-20 w-full bg-[repeating-linear-gradient(90deg,black_0px,black_2px,transparent_2px,transparent_6px)] mb-2" />
              <p className="text-sm font-bold tracking-[10px]">{shipment.id}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              window.print();
              toast({ title: "Print Started", description: "Sending label to system printer..." });
            }}>
              <Printer className="mr-2 h-4 w-4" /> Print Label
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Delivered": return "success";
    case "In Transit": return "info";
    case "Pending": return "warning";
    case "Delayed": return "destructive";
    default: return "default";
  }
}
