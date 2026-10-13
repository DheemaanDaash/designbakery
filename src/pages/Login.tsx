import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});
const signUpSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const Login = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!loading && user) navigate(isAdmin ? "/admin" : "/portal", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = signInSchema.safeParse({ email, password });
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(p.data as { email: string; password: string });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = signUpSchema.safeParse({ full_name: fullName, email, password });
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: p.data.email,
      password: p.data.password,
      options: { emailRedirectTo: window.location.origin + "/login", data: { full_name: p.data.full_name } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account, then sign in.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Sign in | Design Bakery</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-primary text-center mb-6">Your Design Bakery account</h1>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4">
                <div><Label htmlFor="si-email">Email</Label><Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label htmlFor="si-pass">Password</Label><Input id="si-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={busy} className="w-full rounded-full">{busy ? "Signing in..." : "Sign in"}</Button>
                <p className="text-sm text-center"><Link to="/forgot-password" className="text-primary hover:underline">Forgot your password?</Link></p>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4">
                <div><Label htmlFor="su-name">Full name</Label><Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div><Label htmlFor="su-email">Email</Label><Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label htmlFor="su-pass">Password</Label><Input id="su-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={busy} className="w-full rounded-full">{busy ? "Creating..." : "Create account"}</Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="text-xs text-muted-foreground text-center mt-6"><Link to="/" className="hover:text-primary">Back to website</Link></p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
