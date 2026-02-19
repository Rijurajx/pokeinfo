import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Post } from "@/sanity/lib/api";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(800).height(featured ? 450 : 300).url() : '/placeholder.svg' // Fallback handled

  return (
    <Link 
      href={`/blogs/${post.slug.current}`}
      className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col ${featured ? 'h-full' : ''}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-video w-full' : 'aspect-[16/9]'}`}>
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        
        {/* Categories Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {post.categories?.slice(0, 2).map((cat) => (
            <span key={cat} className="px-2 py-1 text-xs font-medium rounded-md bg-background/80 text-primary backdrop-blur-sm border border-primary/20">
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className={`font-bold leading-tight group-hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
          {post.title}
        </h3>
        
        <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{post.author || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Recently'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
