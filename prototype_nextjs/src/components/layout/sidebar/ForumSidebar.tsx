import Link from 'next/link';

import Box from '@mui/material/Box';

// TODO: ForumSidebar
export default function ForumSidebar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link href="/forum/authors">
        <p>Authors</p>
      </Link>
      (This is the Forum sidebar)
    </Box>
  );
}
