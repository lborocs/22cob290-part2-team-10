import { type NextRequest, NextResponse } from 'next/server';

// FIXME: middleware not doing anything

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('middleware');
  console.log('request =', request);
  return NextResponse.next();
  // return NextResponse.redirect(new URL('/about-2', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // '/(.*)',
    '/:path*',
    // '/about/:path*',
    // '/dashboard/:path*',
    '/projects/:path*',
  ],
};

// FIXME: isnt working (would rather use middleware than Component.noauth)
// not protect: / & /signup

// export { default } from 'next-auth/middleware';
