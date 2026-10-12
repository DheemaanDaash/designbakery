import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { REQUEST_STATUSES, requestStatusLabel, statusVariant, type RequestStatus } from "@/lib/status";

type Req = Tables<"design_requests">;
const linkSchema = z.string().trim().url("Enter a valid URL").max(1000).regex(/^https?:\/\//i, "Must start with http(s)://");

const AdminRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Req | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("design_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      const d = r.created_at.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (q && ![r.request_name, r.email, r.design_type].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [requests, search, status, from, to]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">Design Requests</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="Search name, email, type" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {REQUEST_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" aria-label="Submitted from" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" aria-label="Submitted to" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead><TableHead>Client email</TableHead><TableHead>Type</TableHead>
              <TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead>Deadline</TableHead><TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No requests found.</TableCell></TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell className="font-medium">{r.request_name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.design_type}</TableCell>
                  <TableCell><Badge variant={statusVariant(r.status)}>{requestStatusLabel(r.status)}</Badge></TableCell>
                  <TableCell>{format(new Date(r.created_at), "PP")}</TableCell>
                  <TableCell>{format(new Date(r.deadline), "PP")}</TableCell>
                  <TableCell>{format(new Date(r.updated_at), "PP")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <RequestDetail request={selected} onClose={() => setSelected(null)} onSaved={setSelected} />
    </div>
  );
};

const RequestDetail = ({ request, onClose, onSaved }: { request: Req | null; onClose: () => void; onSaved: (r: Req) => void }) => {
  const qc = useQueryClient();
  const [status, setStatus] = useState<RequestStatus>("new");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  if (request && loadedId !== request.id) {
    setLoadedId(request.id);
    setStatus(request.status);
    setLink(request.delivery_link ?? "");
    setNote("");
  }

  const id = request?.id;
  const { data: notes = [] } = useQuery({
    queryKey: ["request-notes", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("request_notes").select("*").eq("request_id", id!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: history = [] } = useQuery({
    queryKey: ["request-history", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("request_status_history").select("*").eq("request_id", id!).order("changed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: imageUrl } = useQuery({
    queryKey: ["request-image", request?.reference_image_url],
    enabled: !!request?.reference_image_url,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("design-references").createSignedUrl(request!.reference_image_url!, 600);
      if (error) throw error;
      return data.signedUrl;
    },
  });

  const save = async () => {
    if (!request) return;
    let delivery: string | null = null;
    if (link.trim()) {
      const p = linkSchema.safeParse(link);
      if (!p.success) return toast.error(p.error.issues[0].message);
      delivery = p.data;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("design_requests")
      .update({ status, delivery_link: delivery })
      .eq("id", request.id)
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Request updated");
    onSaved(data);
    qc.invalidateQueries({ queryKey: ["admin-requests"] });
    qc.invalidateQueries({ queryKey: ["request-history", request.id] });
  };

  const addNote = async () => {
    const body = note.trim();
    if (!request || !body) return;
    if (body.length > 5000) return toast.error("Note is too long");
    const { error } = await supabase.from("request_notes").insert({ request_id: request.id, body });
    if (error) return toast.error(error.message);
    setNote("");
    qc.invalidateQueries({ queryKey: ["request-notes", request.id] });
  };

  return (
    <Sheet open={!!request} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {request && (
          <>
            <SheetHeader><SheetTitle className="text-primary">{request.request_name}</SheetTitle></SheetHeader>
            <div className="mt-6 space-y-6 text-sm">
              <dl className="grid grid-cols-3 gap-x-3 gap-y-2">
                <dt className="text-muted-foreground">Email</dt><dd className="col-span-2 break-all">{request.email}</dd>
                <dt className="text-muted-foreground">Type</dt><dd className="col-span-2">{request.design_type}</dd>
                <dt className="text-muted-foreground">Dimension</dt>
                <dd className="col-span-2">{request.dimension === "Other" ? `${request.custom_width} x ${request.custom_height}` : request.dimension}</dd>
                <dt className="text-muted-foreground">Deadline</dt><dd className="col-span-2">{format(new Date(request.deadline), "PPP")}</dd>
                <dt className="text-muted-foreground">Submitted</dt><dd className="col-span-2">{format(new Date(request.created_at), "PPP p")}</dd>
                <dt className="text-muted-foreground">Last updated</dt><dd className="col-span-2">{format(new Date(request.updated_at), "PPP p")}</dd>
                <dt className="text-muted-foreground">Completed</dt><dd className="col-span-2">{request.completed_at ? format(new Date(request.completed_at), "PPP p") : "—"}</dd>
                <dt className="text-muted-foreground">Account</dt><dd className="col-span-2">{request.client_id ? "Linked client" : "Guest"}</dd>
                {request.reference_link && (
                  <>
                    <dt className="text-muted-foreground">Reference</dt>
                    <dd className="col-span-2 break-all"><a href={request.reference_link} target="_blank" rel="noopener noreferrer nofollow" className="text-primary underline">{request.reference_link}</a></dd>
                  </>
                )}
              </dl>
              {imageUrl && <a href={imageUrl} target="_blank" rel="noopener noreferrer"><img src={imageUrl} alt="Reference" className="rounded-lg border border-border max-h-60" /></a>}
              <div>
                <p className="text-muted-foreground mb-1">Design content</p>
                <p className="whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{request.design_content}</p>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as RequestStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{REQUEST_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="delivery">Final delivery link</Label>
                  <Input id="delivery" placeholder="https://drive.google.com/..." value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <Button onClick={save} disabled={saving} className="rounded-full">{saving ? "Saving..." : "Save changes"}</Button>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <p className="font-semibold">Internal notes <span className="font-normal text-muted-foreground">(private — never shown to clients)</span></p>
                <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." />
                <Button variant="outline" size="sm" onClick={addNote} disabled={!note.trim()}>Add note</Button>
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li key={n.id} className="bg-muted/50 rounded-lg p-3">
                      <p className="whitespace-pre-wrap">{n.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.created_at), "PP p")}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <p className="font-semibold">Status history</p>
                <ul className="space-y-1">
                  {history.map((h) => (
                    <li key={h.id} className="flex flex-wrap gap-2 items-center">
                      {h.from_status ? <>{requestStatusLabel(h.from_status)} →</> : <span className="text-muted-foreground">Submitted as</span>}
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

export default AdminRequests;
