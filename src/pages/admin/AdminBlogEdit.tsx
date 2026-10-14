import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "@/components/Markdown";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().min(1, "Slug is required").max(120).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug: lowercase letters, numbers and dashes only"),
  excerpt: z.string().trim().max(500),
  content: z.string().max(100000),
  featured_image_url: z.string().trim().max(1000).refine((v) => !v || /^https:\/\//.test(v), "Image must be an https URL"),
  seo_title: z.string().trim().max(70, "SEO title: max 70 characters"),
  seo_description: z.string().trim().max(170, "SEO description: max 170 characters"),
  published: z.boolean(),
});
type Form = z.infer<typeof schema>;
const empty: Form = { title: "", slug: "", excerpt: "", content: "", featured_image_url: "", seo_title: "", seo_description: "", published: false };

const AdminBlogEdit = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("blog_posts").select("*").eq("id", id!).maybeSingle().then(({ data, error }) => {
      setLoading(false);
      if (error || !data) return toast.error("Post not found");
      setSlugTouched(true);
      setForm({
        title: data.title, slug: data.slug, excerpt: data.excerpt ?? "", content: data.content,
        featured_image_url: data.featured_image_url ?? "", seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "", published: data.published,
      });
    });
  }, [id, isNew]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v, ...(k === "title" && !slugTouched ? { slug: slugify(v as string) } : {}) }));

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploading(true);
    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const path = `blog/${base}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("brand-assets").upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) return toast.error(error.message);
    set("featured_image_url", supabase.storage.from("brand-assets").getPublicUrl(path).data.publicUrl);
  };

  const save = async () => {
    const p = schema.safeParse(form);
    if (!p.success) return toast.error(p.error.issues[0].message);
    const d = p.data;
    const row = {
      title: d.title, slug: d.slug, excerpt: d.excerpt || null, content: d.content,
      featured_image_url: d.featured_image_url || null, seo_title: d.seo_title || null,
      seo_description: d.seo_description || null, published: d.published,
    };
    setSaving(true);
    const res = isNew
      ? await supabase.from("blog_posts").insert(row).select("id").single()
      : await supabase.from("blog_posts").update(row).eq("id", id!).select("id").single();
    setSaving(false);
    if (res.error) {
      return toast.error(res.error.code === "23505" ? "That slug is already used by another post" : res.error.message);
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
    if (isNew) navigate(`/admin/blog/${res.data.id}`, { replace: true });
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mr-auto">{isNew ? "New post" : "Edit post"}</h1>
        <div className="flex items-center gap-2">
          <Switch id="pub" checked={form.published} onCheckedChange={(v) => set("published", v)} />
          <Label htmlFor="pub">{form.published ? "Published" : "Draft"}</Label>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/blog")}>Back</Button>
        <Button onClick={save} disabled={saving} className="rounded-full">{saving ? "Saving..." : "Save"}</Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div><Label htmlFor="title">Title</Label><Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input id="slug" value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
          <p className="text-xs text-muted-foreground mt-1">/blog/{form.slug || "your-post"}{!isNew && form.published && " — changing this breaks existing links"}</p>
        </div>
        <div><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>
        <div>
          <Label>Featured image</Label>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <label className="flex items-center gap-2 border border-dashed border-border rounded-lg px-4 py-2 cursor-pointer hover:border-primary text-sm">
              <Upload size={16} className="text-primary" /> {uploading ? "Uploading..." : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {form.featured_image_url && <Button size="sm" variant="ghost" onClick={() => set("featured_image_url", "")}>Remove</Button>}
          </div>
          {form.featured_image_url && <img src={form.featured_image_url} alt="" className="mt-3 rounded-lg max-h-48" />}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <Tabs defaultValue="write">
          <TabsList><TabsTrigger value="write">Write</TabsTrigger><TabsTrigger value="preview">Preview</TabsTrigger></TabsList>
          <TabsContent value="write">
            <Textarea rows={18} className="font-mono text-sm" value={form.content} onChange={(e) => set("content", e.target.value)}
              placeholder={"## Heading\n\nWrite your post using Markdown. **bold**, *italic*, [link](https://...), - lists"} />
          </TabsContent>
          <TabsContent value="preview" className="pt-4">
            <h1 className="text-3xl font-bold text-primary mb-4">{form.title || "Untitled"}</h1>
            {form.featured_image_url && <img src={form.featured_image_url} alt="" className="w-full rounded-xl mb-6" />}
            <Markdown>{form.content || "_Nothing to preview yet._"}</Markdown>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <p className="font-semibold">Search engine settings</p>
        <div>
          <Label htmlFor="seo_title">SEO title <span className="text-muted-foreground">({form.seo_title.length}/70)</span></Label>
          <Input id="seo_title" value={form.seo_title} placeholder={form.title} onChange={(e) => set("seo_title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="seo_desc">SEO description <span className="text-muted-foreground">({form.seo_description.length}/170)</span></Label>
          <Textarea id="seo_desc" rows={2} value={form.seo_description} placeholder={form.excerpt} onChange={(e) => set("seo_description", e.target.value)} />
        </div>
        <div className="rounded-lg border border-border p-3 text-sm">
          <p className="text-primary font-medium truncate">{form.seo_title || form.title || "Post title"} | Design Bakery</p>
          <p className="text-xs text-muted-foreground">designbakery.lovable.app/blog/{form.slug}</p>
          <p className="text-muted-foreground line-clamp-2">{form.seo_description || form.excerpt || "Post description"}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEdit;
