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
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return apiRequest("POST", "/api/auth/login", data);
    },
    onSuccess: async (response) => {
      const userData = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(userData.user));
      navigate("/dashboard");
    },
    onError: (error: any) => {
      setError(t("invalidCredentials", "Invalid credentials. Please try again."));
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-white shadow-lg" data-testid="login-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-slate-900" data-testid="login-title">
                {t("adminLogin", "Admin Login")}
              </CardTitle>
              <CardDescription data-testid="login-description">
                {t("adminDashboardAccess", "Access the admin dashboard to manage listings")}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="username">{t("username", "Username")}</Label>
                  <Input
                    id="username"
                    {...form.register("username")}
                    placeholder={t("usernamePlaceholder", "admin")}
                    data-testid="username-input"
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-600 mt-1" data-testid="username-error">
                      {form.formState.errors.username.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">{t("password", "Password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder={t("passwordPlaceholder", "password")}
                    data-testid="password-input"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1" data-testid="password-error">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                {error && (
                  <Alert variant="destructive" data-testid="login-error">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
                  disabled={loginMutation.isPending}
                  data-testid="login-submit-button"
                >
                  {loginMutation.isPending ? t("signingIn", "Signing In...") : t("signIn", "Sign In")}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-slate-500" data-testid="demo-credentials">
              </div>
              
              <div className="mt-4 text-center">
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
