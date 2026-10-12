import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACTIVE_STATUSES, requestStatusLabel, statusVariant } from "@/lib/status";

const AdminDashboard = () => {
  const { data: requests = [] } = useQuery({
    queryKey: ["admin-requests-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("design_requests").select("id,status");
      if (error) throw error;
      return data;
    },
  });
  const { data: activity = [] } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("request_status_history")
        .select("id,from_status,to_status,changed_at,request_id,design_requests(request_name)")
        .order("changed_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });
  const { data: newContacts = 0 } = useQuery({
    queryKey: ["admin-new-contacts"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      if (error) throw error;
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Total requests", value: requests.length },
    { label: "New", value: requests.filter((r) => r.status === "new").length },
    { label: "In progress", value: requests.filter((r) => ACTIVE_STATUSES.includes(r.status)).length },
    { label: "Completed", value: requests.filter((r) => r.status === "completed").length },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold text-primary">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>
      <Link to="/admin/inbox" className="block">
        <Card className="hover:border-primary transition-colors">
          <CardContent className="py-4 text-sm">
            <span className="font-semibold text-primary">{newContacts}</span> new contact message{newContacts === 1 ? "" : "s"} in the inbox
          </CardContent>
        </Card>
      </Link>
      <Card>
        <CardHeader><CardTitle className="text-lg">Recent activity</CardTitle></CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {activity.map((a) => (
                <li key={a.id} className="py-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{a.design_requests?.request_name ?? "Request"}</span>
                  {a.from_status ? (
                    <>
                      <Badge variant="outline">{requestStatusLabel(a.from_status)}</Badge>→
                    </>
                  ) : (
                    <span className="text-muted-foreground">submitted</span>
                  )}
                  <Badge variant={statusVariant(a.to_status)}>{requestStatusLabel(a.to_status)}</Badge>
                  <span className="ml-auto text-muted-foreground text-xs">{format(new Date(a.changed_at), "PP p")}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
