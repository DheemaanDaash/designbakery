import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,featured_image_url,published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title="Blog — Design Tips & Insights | Design Bakery"
        description="Design tips, branding advice and creative insights from the Design Bakery team."
        path="/blog"
      />
      <Navbar />
      <section className="bg-[#A7792E10] py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Blog</h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Design tips, branding advice and creative insights from our team.</p>
      </section>
      <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                {p.featured_image_url && (
                  <img src={p.featured_image_url} alt={p.title} loading="lazy" className="w-full aspect-video object-cover" />
                )}
                <div className="p-5 space-y-2">
                  {p.published_at && <p className="text-xs text-muted-foreground">{format(new Date(p.published_at), "PPP")}</p>}
                  <h2 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{p.title}</h2>
                  {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
