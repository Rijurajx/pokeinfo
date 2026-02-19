import { PortableText } from "@portabletext/react";
import { getPost } from "@/sanity/lib/api";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage ? urlFor(post.mainImage).url() : null;

  return (
    <article className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {imageUrl ? (
            <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            />
        ) : (
            <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="container mx-auto">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-primary hover:underline mb-6 font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Blogs
                </Link>
                <div className="max-w-4xl space-y-4">
                    {post.categories && (
                        <div className="flex gap-2">
                        {post.categories.map((cat) => (
                            <span key={cat} className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-sm font-semibold backdrop-blur-md">
                            {cat}
                            </span>
                        ))}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-white glow-type">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 text-muted-foreground/80">
                         <div className="flex items-center gap-2">
                             <div className="p-2 bg-secondary/20 rounded-full">
                                <User className="w-4 h-4 text-secondary" />
                             </div>
                             <span className="font-medium text-foreground">{post.author || 'Admin'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4" />
                             <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Recently'}</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground">
          <PortableText 
            value={post.body} 
            components={{
                types: {
                    image: ({value}) => {
                        return (
                            <div className="relative w-full h-96 my-8 rounded-xl overflow-hidden border border-border">
                                <Image 
                                    src={urlFor(value).url()} 
                                    alt={value.alt || 'Post image'}
                                    fill
                                    className="object-contain" 
                                />
                            </div>
                        )
                    }
                }
            }}
          />
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
           <h3 className="text-2xl font-bold mb-6">Read More</h3>
           {/* Could add related posts here */}
           <Link href="/blogs" className="text-primary hover:text-primary/80 font-medium">
              Browse all articles &rarr;
           </Link>
        </div>
      </div>
    </article>
  );
}
