import { auth0 } from '@/lib/auth0';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  _context: { params: Promise<{ auth0: string }> }
) {
  return auth0.middleware(req);
}

export async function POST(
  req: NextRequest,
  _context: { params: Promise<{ auth0: string }> }
) {
  return auth0.middleware(req);
}
