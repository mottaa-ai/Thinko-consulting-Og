import 'server-only';
import { db } from './db/index';
import { articles } from './db/schema';
import { eq, desc, and, asc } from 'drizzle-orm';

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  category: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  isPublished: boolean;
}

/**
 * Get all published articles, ordered by publication date (newest first)
 */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt));

    return result as Article[];
  } catch (error) {
    console.error("[v0] Error fetching published articles:", error);
    return [];
  }
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const [result] = await db
      .select()
      .from(articles)
      .where(and(
        eq(articles.slug, slug),
        eq(articles.isPublished, true)
      ));

    return result || null;
  } catch (error) {
    console.error("[v0] Error fetching article by slug:", error);
    return null;
  }
}

/**
 * Get all articles (including unpublished) - admin use only
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt));

    return result as Article[];
  } catch (error) {
    console.error("[v0] Error fetching all articles:", error);
    return [];
  }
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.category, category),
          eq(articles.isPublished, true)
        )
      )
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt));

    return result as Article[];
  } catch (error) {
    console.error("[v0] Error fetching articles by category:", error);
    return [];
  }
}

/**
 * Get featured articles (limit)
 */
export async function getFeaturedArticles(limit: number = 6): Promise<Article[]> {
  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
      .limit(limit);

    return result as Article[];
  } catch (error) {
    console.error("[v0] Error fetching featured articles:", error);
    return [];
  }
}

/**
 * Create a new article
 */
export async function createArticle(data: {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  category?: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt?: Date;
  isPublished?: boolean;
  updatedBy?: string;
}): Promise<Article | null> {
  try {
    const [result] = await db
      .insert(articles)
      .values({
        ...data,
        isPublished: data.isPublished ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result as Article;
  } catch (error) {
    console.error("[v0] Error creating article:", error);
    throw error;
  }
}

/**
 * Update an article
 */
export async function updateArticle(
  id: number,
  data: Partial<{
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    sourceUrl: string;
    sourceName: string;
    publishedAt: Date;
    isPublished: boolean;
    updatedBy: string;
  }>
): Promise<Article | null> {
  try {
    const [result] = await db
      .update(articles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    return result || null;
  } catch (error) {
    console.error("[v0] Error updating article:", error);
    throw error;
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id: number): Promise<boolean> {
  const result = await db
    .delete(articles)
    .where(eq(articles.id, id))

  return (result.rowCount ?? 0) > 0
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const result = await db
      .select({ category: articles.category })
      .from(articles)
      .where(eq(articles.isPublished, true))
      .groupBy(articles.category);

    return result
      .map(r => r.category)
      .filter((c): c is string => c !== null);
  } catch (error) {
    console.error("[v0] Error fetching categories:", error);
    return [];
  }
}
