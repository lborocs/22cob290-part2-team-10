import type { Prisma } from '@prisma/client';

type PostWithDate = Prisma.PostGetPayload<{
  select: {
    history: {
      select: {
        date: true;
      };
    };
  };
}>;

export type SerializablePost<T extends PostWithDate> = T & {
  history: {
    date: number;
  }[];
};

export function asSerializablePost<T extends PostWithDate>(
  post: T
): SerializablePost<T> {
  return {
    ...post,
    history: post.history.map((history) => ({
      ...history,
      date: history.date.getTime(),
    })),
  };
}
