import { range } from '~/utils';

export type Post = {
  id: number
  author: string
  datePosted: number
  title: string
  content: string
  topics: string[]
};

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

const posts: Post[] = range(1, numPosts).map((num) => ({
  id: num,
  author: 'alice@make-it-all.co.uk',
  datePosted: randomTimeMs(),
  title: `Post ${num}`,
  content: `${num} squared = ${num * num}`,
  topics: range(1, num).map((n) => `Topic ${n}`),
}));

export async function getAllPosts(): Promise<Post[]> {
  return posts;
}

export async function getPost(id: number): Promise<Post | null> {
  return posts.find((post) => post.id === id) ?? null;
}
