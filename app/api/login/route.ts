import { NextResponse } from 'next/server';

import { serialize } from 'cookie';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username === process.env.NEXT_PUBLIC_DASHBOARD_USERNAME &&
    password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD
  ) {
    const cookie = serialize('loggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return new NextResponse(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });
  }
  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
