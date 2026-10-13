import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExternalLink, LogOut, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { ACTIVE_STATUSES, requestStatusLabel, statusVariant } from "@/lib/status";

type Req = Tables<"design_requests">;

const Portal = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [selected, setSelected] = useState<Req | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["portal-requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Database rules only return this client's own requests.
      const { data, error } = await supabase
        .from("design_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;

  const cards = [
    { label: "All requests", value: requests.length },
    { label: "New", value: requests.filter((r) => r.status === "new").length },
    { label: "In progress", value: requests.filter((r) => ACTIVE_STATUSES.includes(r.status)).length },
    { label: "Completed", value: requests.filter((r) => r.status === "completed").length },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>My requests | Design Bakery</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-10 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">My design requests</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button asChild className="rounded-full gap-2"><Link to="/design-request"><Plus size={16} /> New request</Link></Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={signOut}><LogOut size={16} /> Sign out</Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Card key={c.label}>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-primary">{c.value}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead><TableHead>Deadline</TableHead><TableHead>Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No requests yet. <Link to="/design-request" className="text-primary underline">Submit your first one</Link>.
                </TableCell></TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                    <TableCell className="font-medium">{r.request_name}</TableCell>
                    <TableCell>{r.design_type}</TableCell>
                    <TableCell><Badge variant={statusVariant(r.status)}>{requestStatusLabel(r.status)}</Badge></TableCell>
                    <TableCell>{format(new Date(r.created_at), "PP")}</TableCell>
                    <TableCell>{format(new Date(r.deadline), "PP")}</TableCell>
                    <TableCell>{r.delivery_link ? "Ready" : "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          Requests you sent before creating an account appear here automatically when they used the same email.
        </p>
      </main>
      <Footer />
      <RequestDetail request={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

const RequestDetail = ({ request, onClose }: { request: Req | null; onClose: () => void }) => {
  const id = request?.id;
  const { data: history = [] } = useQuery({
    queryKey: ["portal-history", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("request_status_history")
        .select("id,from_status,to_status,changed_at")
        .eq("request_id", id!)
        .order("changed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: imageUrl } = useQuery({
    queryKey: ["portal-image", request?.reference_image_url],
    enabled: !!request?.reference_image_url,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("design-references").createSignedUrl(request!.reference_image_url!, 600);
      if (error) throw error;
      return data.signedUrl;
    },
  });

  return (
    <Sheet open={!!request} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {request && (
          <>
            <SheetHeader><SheetTitle className="text-primary">{request.request_name}</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-5 text-sm">
              <Badge variant={statusVariant(request.status)}>{requestStatusLabel(request.status)}</Badge>
              {request.delivery_link && (
                <Button asChild className="rounded-full gap-2 w-full">
                  <a href={request.delivery_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Open final delivery</a>
                </Button>
              )}
              <dl className="grid grid-cols-3 gap-y-2">
                <dt className="text-muted-foreground">Type</dt><dd className="col-span-2">{request.design_type}</dd>
                <dt className="text-muted-foreground">Dimension</dt>
                <dd className="col-span-2">{request.dimension === "Other" ? `${request.custom_width} x ${request.custom_height}` : request.dimension}</dd>
                <dt className="text-muted-foreground">Deadline</dt><dd className="col-span-2">{format(new Date(request.deadline), "PPP")}</dd>
                <dt className="text-muted-foreground">Submitted</dt><dd className="col-span-2">{format(new Date(request.created_at), "PPP")}</dd>
                <dt className="text-muted-foreground">Last updated</dt><dd className="col-span-2">{format(new Date(request.updated_at), "PPP")}</dd>
                <dt className="text-muted-foreground">Completed</dt><dd className="col-span-2">{request.completed_at ? format(new Date(request.completed_at), "PPP") : "—"}</dd>
              </dl>
              {imageUrl && <img src={imageUrl} alt="Your reference" className="rounded-lg border border-border max-h-60" />}
              <div>
                <p className="text-muted-foreground mb-1">Your brief</p>
                <p className="whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{request.design_content}</p>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <p className="font-semibold">Progress</p>
                <ul className="space-y-1">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center gap-2">
                      <Badge variant={statusVariant(h.to_status)}>{requestStatusLabel(h.to_status)}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{format(new Date(h.changed_at), "PP p")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Portal;
