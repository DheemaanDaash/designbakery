import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Mail } from "lucide-react";
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
import { CONTACT_STATUSES, contactStatusLabel, statusVariant, type ContactStatus } from "@/lib/status";

type Msg = Tables<"contact_submissions">;

const AdminInbox = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Msg | null>(null);
  const [status, setStatus] = useState<ContactStatus>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter(
      (m) =>
        (filter === "all" || m.status === filter) &&
        (!q || [m.name, m.email, m.message].some((v) => v.toLowerCase().includes(q))),
    );
  }, [messages, search, filter]);

  const open = (m: Msg) => {
    setSelected(m);
    setStatus(m.status);
    setNotes(m.private_notes ?? "");
  };

  const save = async () => {
    if (!selected) return;
    if (notes.length > 5000) return toast.error("Notes are too long");
    setSaving(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .update({ status, private_notes: notes.trim() || null })
      .eq("id", selected.id)
      .select()
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setSelected(data);
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  };

  const mailto = (m: Msg) =>
    `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: Your message to Design Bakery")}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">Contact Inbox</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Input placeholder="Search name, email, message" value={search} onChange={(e) => setSearch(e.target.value)} className="md:col-span-2" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {CONTACT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Received</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No messages.</TableCell></TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow key={m.id} className="cursor-pointer" onClick={() => open(m)}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{m.message}</TableCell>
                  <TableCell><Badge variant={statusVariant(m.status)}>{contactStatusLabel(m.status)}</Badge></TableCell>
                  <TableCell>{format(new Date(m.created_at), "PP")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader><SheetTitle className="text-primary">{selected.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-5 text-sm">
                <dl className="grid grid-cols-3 gap-y-2">
                  <dt className="text-muted-foreground">Email</dt><dd className="col-span-2 break-all">{selected.email}</dd>
                  <dt className="text-muted-foreground">Phone</dt><dd className="col-span-2">{selected.phone ?? "—"}</dd>
                  <dt className="text-muted-foreground">Received</dt><dd className="col-span-2">{format(new Date(selected.created_at), "PPP p")}</dd>
                </dl>
                <p className="whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{selected.message}</p>
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <a href={mailto(selected)}><Mail size={16} /> Reply by email</a>
                </Button>
                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ContactStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CONTACT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pnotes">Private notes</Label>
                    <Textarea id="pnotes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <Button onClick={save} disabled={saving} className="rounded-full">{saving ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminInbox;
