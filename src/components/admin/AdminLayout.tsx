import { NavLink, Navigate, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LayoutDashboard, FileText, Inbox, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/requests", label: "Design Requests", icon: FileText },
  { to: "/admin/inbox", label: "Contact Inbox", icon: Inbox },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold text-primary">You don't have access to the admin panel.</p>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      <Helmet>
        <title>Admin | Design Bakery</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <aside className="md:w-60 bg-card border-b md:border-b-0 md:border-r border-border p-4 flex md:flex-col gap-2 md:gap-1 overflow-x-auto">
        <div className="hidden md:block mb-6 px-2">
          <img src={BRAND_ASSETS.logo} alt="Design Bakery" className="h-8 w-auto" />
          <p className="text-xs text-muted-foreground mt-2">Admin panel</p>
        </div>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
              )
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        <Button variant="ghost" size="sm" onClick={signOut} className="md:mt-auto justify-start gap-2">
          <LogOut size={16} /> Sign out
        </Button>
      </aside>
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
