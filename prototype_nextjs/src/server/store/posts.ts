import type { Post } from '~/types';
import { range } from '~/utils';

/**
 * Generate a random date between today and the start of 2022.
 *
 * Example:
 * ```ts
 * const randomDate = new Date(randomTimeMs());
 * ```
 *
 * [Source](https://stackoverflow.com/a/9035732)
 */
function randomTimeMs(): number {
  const start = new Date(2022, 1, 1).getTime();
  const end = Date.now();

  const diff = end - start;

  return start + (Math.random() * diff);
}

const numPosts = 10;

// TODO: use userId for author instead of email

const posts: Post[] = range(1, numPosts).map((num) => ({
  id: num,
  author: 'alice@make-it-all.co.uk',
  datePosted: randomTimeMs(),
  title: `Post ${num}`,
  content: `${num} squared = ${num * num}`,
  topics: range(1, num).map((n) => `Topic ${n}`),
})).concat([
  {
    id: 70,
    author: 'manager@make-it-all.co.uk',
    datePosted: randomTimeMs(),
    title: 'Only manager can edit this',
    content: 'eeee',
    topics: [],
  },
]);

export async function getAllPosts(): Promise<Post[]> {
  return posts;
}

export async function getPost(id: number): Promise<Post | null> {
  return posts.find((post) => post.id === id) ?? null;
}
