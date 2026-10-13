import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthCard from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    if (window.location.hash.includes("type=recovery")) setReady(true);
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || password.length > 72) return toast.error("Password must be 8–72 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate("/portal", { replace: true });
  };

  return (
    <AuthCard title="Choose a new password">
      {!ready ? (
        <p className="text-sm text-center text-muted-foreground">
          This page only works from the reset link in your email.{" "}
          <Link to="/forgot-password" className="text-primary hover:underline">Request a new link</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><Label htmlFor="rp-pass">New password</Label><Input id="rp-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div><Label htmlFor="rp-conf">Confirm password</Label><Input id="rp-conf" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          <Button type="submit" disabled={busy} className="w-full rounded-full">{busy ? "Saving..." : "Update password"}</Button>
        </form>
      )}
    </AuthCard>
  );
};

export default ResetPassword;
