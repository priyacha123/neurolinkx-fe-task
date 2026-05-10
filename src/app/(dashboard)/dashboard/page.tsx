"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Ship,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
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

import { useShipments } from "@/lib/shipments";

const data = [
  { name: "Jan", shipments: 400, revenue: 2400 },
  { name: "Feb", shipments: 300, revenue: 1398 },
  { name: "Mar", shipments: 200, revenue: 9800 },
  { name: "Apr", shipments: 278, revenue: 3908 },
  { name: "May", shipments: 189, revenue: 4800 },
  { name: "Jun", shipments: 239, revenue: 3800 },
  { name: "Jul", shipments: 349, revenue: 4300 },
];

export default function DashboardOverview() {
  const { toast } = useToast();
  const { shipments, addShipment } = useShipments();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    customer: "",
    origin: "",
    destination: "",
    priority: "Medium" as const,
  });

  const stats = [
    {
      title: "Total Shipments",
      value: shipments.length.toString(),
      description: "+12.5% from last month",
      icon: Ship,
      trend: "up",
    },
    {
      title: "On-Time Rate",
      value: "94.2%",
      description: "+2.1% from last month",
      icon: CheckCircle2,
      trend: "up",
    },
    {
      title: "Pending Deliveries",
      value: shipments.filter(s => s.status === "Pending").length.toString(),
      description: "-4 from yesterday",
      icon: Clock,
      trend: "down",
    },
    {
      title: "Active Issues",
      value: shipments.filter(s => s.status === "Delayed").length.toString(),
      description: "+1 from yesterday",
      icon: AlertCircle,
      trend: "up",
      variant: "destructive" as const,
    },
  ];

  const handleDownloadCSV = () => {
    const headers = "Month,Shipments,Revenue\n";
    const csvRows = data.map(row => `${row.name},${row.shipments},${row.revenue}`).join("\n");
    const blob = new Blob([headers + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "shipment_data.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Success",
      description: "Shipment data exported to CSV.",
    });
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addShipment({
      ...formData,
      status: "Pending",
      eta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setFormData({ customer: "", origin: "", destination: "", priority: "Medium" });

    toast({
      title: "Shipment Created",
      description: "The new shipment has been successfully added to the system.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Monitor your logistics performance and shipment status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadCSV}>Download CSV</Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Shipment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4 text-muted-foreground", stat.variant === "destructive" && "text-destructive")} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Shipment Volume</CardTitle>
            <CardDescription>
              Number of shipments handled over the last 7 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="shipments"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest status updates for your shipments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {shipments.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Shipment {activity.id} - {activity.status}
                    </p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {activity.customer} • {activity.destination}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto" asChild>
                    <Link href={`/dashboard/shipments/${activity.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Shipment Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <form onSubmit={handleCreateShipment}>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Fill in the details to register a new shipment in the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input 
                  id="customer" 
                  placeholder="Acme Corp" 
                  value={formData.customer}
                  onChange={(e) => setFormData({...formData, customer: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input 
                    id="origin" 
                    placeholder="Shanghai, CN" 
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    placeholder="Los Angeles, US" 
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Create Shipment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

