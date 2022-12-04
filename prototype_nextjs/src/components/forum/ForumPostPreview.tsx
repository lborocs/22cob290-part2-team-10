import Link from 'next/link';
import type { Post } from '@prisma/client';

import hashids from '~/lib/hashids';

export type ForumPostPreviewProps = {
  post: Omit<Post, 'datePosted'> & {
    datePosted: number
    author: {
      name: string
    }
    topics: {
      name: string
    }[]
  }
};

// Dara recommends using something like Luxon (https://github.com/moment/luxon) to display how long ago a post was made (relative)
// and when they hover over it, have a tooltip saying the actual date & time (absolute)

// TODO: implement & styling etc etc etc etc etc
export default function ForumPostPreview({ post }: ForumPostPreviewProps) {
  const {
    id,
    author,
    datePosted,
    title,
    summary,
    topics,
    upvotes,
  } = post;

  const date = new Date(datePosted);

  return (
    <div className="mb-4">
      <Link href={`/forum/posts/${hashids.encode(id)}`}>
        <p className="h3">{title}</p>
      </Link>
      <span>
        <span><strong>Topics: </strong></span>
        {topics.map((topic, index) => (
          <span className="me-1" key={index}>{topic.name}</span>
        ))}
      </span>
      <p className="mb-0">Votes: {upvotes}</p>
      <p className="mb-0">Author: {author.name}</p>
      <p className="mb-0"><small>Summary: {summary}</small></p>
      <p className="mb-0">Posted: {date.toLocaleDateString()}</p>
    </div>
  );
}
