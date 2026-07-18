import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting map for demonstration (Use Redis in true prod)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  
  // Apply rate limiting only to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requests per minute
    
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
        return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
      }
    }
    
    // Optional: Validate Firebase Auth Bearer token here if desired
    // (Usually better done in the route itself using firebase-admin to decode the token)
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
