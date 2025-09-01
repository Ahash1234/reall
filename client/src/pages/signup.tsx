import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, navigate] = useLocation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      return apiRequest("POST", "/api/auth/signup", {
        username: data.username,
        password: data.password
      });
    },
    onSuccess: async (response) => {
      if (response.ok) {
        setSuccess("Account created successfully! You can now login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create account");
      }
    },
    onError: (error: any) => {
      setError("Failed to create account. Please try again.");
    },
  });

  const onSubmit = (data: SignupForm) => {
    setError("");
    setSuccess("");
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-white shadow-lg" data-testid="signup-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-slate-900" data-testid="signup-title">
                Create Admin Account
              </CardTitle>
              <CardDescription data-testid="signup-description">
                Create a new admin account to manage listings
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...form.register("username")}
                    placeholder="Enter username"
                    data-testid="username-input"
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-600 mt-1" data-testid="username-error">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder="Enter password (min 6 characters)"
                    data-testid="password-input"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1" data-testid="password-error">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    placeholder="Confirm your password"
                    data-testid="confirm-password-input"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1" data-testid="confirm-password-error">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                
                {error && (
                  <Alert variant="destructive" data-testid="signup-error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert variant="default" className="bg-green-50 border-green-200" data-testid="signup-success">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
                  disabled={signupMutation.isPending}
                  data-testid="signup-submit-button"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                  data-testid="back-to-login-button"
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
