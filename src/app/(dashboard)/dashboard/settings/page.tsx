"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Users, Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useShipments, TeamMember } from "@/lib/shipments";
import { format } from "date-fns";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { teamMembers, addTeamMember, updateMemberStatus, removeMember } = useShipments();
  
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Settings saved",
      description: "Your profile has been updated successfully.",
    });
    setIsLoading(false);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    addTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: "Member",
    });

    setInviteEmail("");
    setInviteName("");
    toast({
      title: "Invitation Sent",
      description: `An invite has been sent to ${inviteEmail}.`,
    });
  };

  const toggleStatus = (member: TeamMember) => {
    const newStatus = member.status === "Accepted" ? "Pending" : "Accepted";
    updateMemberStatus(member.id, newStatus);
    toast({
      title: "Status Updated",
      description: `${member.name} is now ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-full w-full rounded-full object-cover border-2 border-muted"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Avatar</h4>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">Upload new</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue={user?.email} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} loading={isLoading}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Invite Member</CardTitle>
                <CardDescription>Invite a new team member to your dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-name">Name</Label>
                    <Input 
                      id="invite-name" 
                      placeholder="John Doe" 
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input 
                      id="invite-email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Send Invitation
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your current team and invitations.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground">{member.email}</p>
                          <p className="text-[9px] text-primary font-medium mt-1">
                            Invited: {format(new Date(member.invitedAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant={member.status === "Accepted" ? "success" : "warning"}
                          className="cursor-pointer select-none"
                          onClick={() => toggleStatus(member)}
                        >
                          {member.status === "Accepted" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {member.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => removeMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
