import type { Prisma } from '@prisma/client';

type PostWithDate = Prisma.PostGetPayload<{
  select: {
    datePosted: true
  },
}>;

export type SerializablePost<T extends PostWithDate> = Omit<T, 'datePosted'> & {
  datePosted: number
};

export function asSerializablePost<T extends PostWithDate>(post: T): SerializablePost<T> {
  return {
    ...post,
    datePosted: post.datePosted.getTime(),
  };
}
