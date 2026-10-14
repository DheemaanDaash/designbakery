import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto max-w-3xl px-4 md:px-8 py-12">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : !post ? (
          <div className="text-center space-y-4">
            <Helmet><title>Post not found | Design Bakery</title><meta name="robots" content="noindex" /></Helmet>
            <h1 className="text-3xl font-bold text-primary">Post not found</h1>
            <Link to="/blog" className="text-primary underline">Back to the blog</Link>
          </div>
        ) : (
          <article className="space-y-6">
            <Seo
              title={`${post.seo_title || post.title} | Design Bakery`}
              description={post.seo_description || post.excerpt || post.title}
              path={`/blog/${post.slug}`}
            />
            <Helmet>
              <meta property="og:type" content="article" />
              {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
            </Helmet>
            <Link to="/blog" className="text-sm text-primary hover:underline">← All posts</Link>
            <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight">{post.title}</h1>
            {post.published_at && <p className="text-sm text-muted-foreground">{format(new Date(post.published_at), "PPP")}</p>}
            {post.featured_image_url && <img src={post.featured_image_url} alt={post.title} className="w-full rounded-2xl" />}
            <Markdown>{post.content}</Markdown>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
