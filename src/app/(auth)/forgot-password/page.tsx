"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email) {
      setIsSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for instructions.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package2 className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSent ? "Check your email" : "Forgot password?"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSent
              ? "We've sent a password reset link to your email."
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSent ? (
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" loading={isLoading}>
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        )}

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="flex items-center justify-center hover:text-brand underline underline-offset-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
