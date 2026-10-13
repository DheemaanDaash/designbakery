import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import AuthCard from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = z.string().trim().email("Enter a valid email").max(255).safeParse(email);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(p.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <AuthCard title="Reset your password">
      {sent ? (
        <p className="text-sm text-center text-muted-foreground">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><Label htmlFor="fp-email">Email</Label><Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button type="submit" disabled={busy} className="w-full rounded-full">{busy ? "Sending..." : "Send reset link"}</Button>
        </form>
      )}
      <p className="text-sm text-center mt-6"><Link to="/login" className="text-primary hover:underline">Back to sign in</Link></p>
    </AuthCard>
  );
};

export default ForgotPassword;
