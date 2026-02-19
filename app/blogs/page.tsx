import { getFeaturedPosts, getRecentPosts } from "@/sanity/lib/api";
import BlogCard from "@/components/BlogCard";
import { format } from "date-fns";

export const revalidate = 60; // ISR every 60 seconds

export default async function BlogsPage() {
  const featuredPosts = await getFeaturedPosts().catch(() => []);
  const recentPosts = await getRecentPosts().catch(() => []);
  
  // If no posts, we might want to show placeholders or a message
  // But for now we render what we have.

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary glow-type">
          News & Guides
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Comprehensive guides to playing Pokémon GO. From beginner to advanced meta guides, we have you covered.
        </p>
      </div>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full glow-blue" />
            <h2 className="text-2xl font-bold">Featured</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post._id} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Main Content Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Latest Posts (Left Column - 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-secondary rounded-full glow-purple" />
                <h2 className="text-2xl font-bold">Latest Updates</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {recentPosts.filter(p => !p.featured).map((post) => ( // Avoid duplicating featured if they appear in recent
               <BlogCard key={post._id} post={post} />
             ))}
             {recentPosts.length === 0 && (
               <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl">
                 <p className="text-muted-foreground">No posts found. Add some in Sanity Studio!</p>
               </div>
             )}
          </div>
        </div>

        {/* Sidebar (Right Column - 4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Trending / Hot Widget */}
          <div className="bg-card/50 border border-border rounded-xl p-6 sticky top-24 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-500">🔥</span> Hot Topics
            </h3>
            <div className="space-y-4">
              {featuredPosts.map((post, idx) => (
                <a key={post._id} href={`/blogs/${post.slug.current}`} className="flex gap-3 group">
                  <span className="text-2xl font-black text-muted-foreground/20 group-hover:text-primary transition-colors">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                       {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d') : ''}
                    </span>
                  </div>
                </a>
              ))}
              {featuredPosts.length === 0 && (
                <p className="text-sm text-muted-foreground">Trending posts will appear here.</p>
              )}
            </div>
            
            {/* Ad Placeholder or Promo */}
            <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
               <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Community Day</p>
               <p className="text-sm">Don't miss the upcoming event! Check out our detailed guide.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
