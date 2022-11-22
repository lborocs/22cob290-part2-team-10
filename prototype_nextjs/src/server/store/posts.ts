import { range } from '~/utils';

export type Post = {
  id: number
  author: string
  datePosted: number
  title: string
  content: string
  topics: string[]
};

// https://stackoverflow.com/a/9035732
function randomDate(): number {
  const start = new Date(2022, 1, 1).getTime();
  const end = Date.now();

  const diff = end - start;

  return start + (Math.random() * diff);
}

const numPosts = 10;

const posts: Post[] = range(1, numPosts).map((num) => ({
  id: num,
  author: 'alice@make-it-all.co.uk',
  datePosted: randomDate(),
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
