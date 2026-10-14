import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminBlog = () => {
  const qc = useQueryClient();
  const [toDelete, setToDelete] = useState<{ id: string; title: string } | null>(null);
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,published,published_at,updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePublish = async (id: string, published: boolean) => {
    const { error } = await supabase.from("blog_posts").update({ published }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(published ? "Published" : "Unpublished");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  const remove = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", toDelete.id);
    setToDelete(null);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mr-auto">Blog</h1>
        <Button asChild className="rounded-full gap-2"><Link to="/admin/blog/new"><Plus size={16} /> New post</Link></Button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Published</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No posts yet.</TableCell></TableRow>
            ) : (
              posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium"><Link to={`/admin/blog/${p.id}`} className="hover:text-primary">{p.title}</Link></TableCell>
                  <TableCell><Badge variant={p.published ? "default" : "outline"}>{p.published ? "Published" : "Draft"}</Badge></TableCell>
                  <TableCell>{p.published_at ? format(new Date(p.published_at), "PP") : "—"}</TableCell>
                  <TableCell>{format(new Date(p.updated_at), "PP")}</TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button asChild size="sm" variant="outline"><Link to={`/admin/blog/${p.id}`}>Edit</Link></Button>
                    <Button size="sm" variant="outline" onClick={() => togglePublish(p.id, !p.published)}>{p.published ? "Unpublish" : "Publish"}</Button>
                    {p.published && <Button asChild size="sm" variant="ghost"><a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">View</a></Button>}
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setToDelete({ id: p.id, title: p.title })}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>"{toDelete?.title}" will be permanently removed. This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;
