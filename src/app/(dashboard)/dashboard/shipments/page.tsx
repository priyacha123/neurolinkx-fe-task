"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Edit,
  Trash,
  Plus,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useShipments, Shipment } from "@/lib/shipments";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const { shipments, deleteShipment, updateShipment } = useShipments();

  // Modals state
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<Shipment["status"]>("Pending");

  const filteredShipments = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteShipment(id);
    toast({
      title: "Shipment Deleted",
      description: `Shipment ${id} has been removed.`,
    });
  };

  const handleUpdateStatus = () => {
    if (selectedShipment) {
      updateShipment(selectedShipment.id, { status: newStatus });
      setIsUpdateStatusOpen(false);
      toast({
        title: "Status Updated",
        description: `Shipment ${selectedShipment.id} is now ${newStatus}.`,
      });
    }
  };

  const handleBulkPrint = () => {
    toast({
      title: "Print Job Started",
      description: `Preparing ${filteredShipments.length} labels for printing...`,
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
          <p className="text-muted-foreground">
            Manage and track all outgoing and incoming shipments.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            <Plus className="mr-2 h-4 w-4" /> New Shipment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or customer..."
                  className="pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    if (filteredShipments.length > 0) {
                      setSelectedShipment(filteredShipments[0]);
                      setIsUpdateStatusOpen(true);
                    }
                  }}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Update Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkPrint}>
                    <Printer className="mr-2 h-4 w-4" /> Print Labels
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" /> Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Origin / Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.customer}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p>{shipment.origin}</p>
                      <p className="text-muted-foreground">to {shipment.destination}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(shipment.status)}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(shipment.priority)}>
                      {shipment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{shipment.eta}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/shipments/${shipment.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedShipment(shipment);
                          setNewStatus(shipment.status);
                          setIsUpdateStatusOpen(true);
                        }}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(shipment.id)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Status Modal */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>
              Change the current stage of shipment {selectedShipment?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="bulk-status">New Status</Label>
            <select
              id="bulk-status"
              className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
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

function getPriorityVariant(priority: string) {
  switch (priority) {
    case "High": return "destructive";
    case "Medium": return "warning";
    case "Low": return "default";
    default: return "default";
  }
}
