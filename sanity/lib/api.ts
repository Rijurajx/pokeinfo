import { client } from "./client";

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  author: string;
  mainImage: any;
  categories: string[];
  publishedAt: string;
  featured: boolean;
  body: any;
}

export async function getPosts(): Promise<Post[]> {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      mainImage,
      categories,
      publishedAt,
      featured
    }
  `);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return client.fetch(`
    *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      author,
      mainImage,
      categories,
      publishedAt
    }
  `);
}

export async function getRecentPosts(): Promise<Post[]> {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0...10] {
      _id,
      title,
      slug,
      author,
      mainImage,
      categories,
      publishedAt
    }
  `);
}

export async function getPost(slug: string): Promise<Post> {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      ...,
      body
    }
  `,
    { slug }
  );
}
