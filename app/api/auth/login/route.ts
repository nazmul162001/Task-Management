import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createSessionToken, verifyPassword } from '@/app/lib/auth';

interface LoginPayload {
  identifier?: string;
  password?: string;
}

const COOKIE_NAME = 'task_manager_token';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;
    const errors: Record<string, string> = {};

    if (!body.identifier || body.identifier.trim().length === 0) {
      errors.identifier = 'Username or email is required.';
    }

    if (!body.password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Invalid form data.', errors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: body.identifier },
          { email: body.identifier?.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid credentials.',
          errors: { identifier: 'No account found for that username/email.' },
        },
        { status: 401 }
      );
    }

    const passwordsMatch = await verifyPassword(
      body.password!,
      user.password
    );

    if (!passwordsMatch) {
      return NextResponse.json(
        {
          error: 'Invalid credentials.',
          errors: { password: 'Incorrect password.' },
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user.id);
    const response = NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email },
    });

    // In Vercel/production, always use secure cookies (HTTPS required)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    console.error('[LOGIN] Error message:', error?.message);
    console.error('[LOGIN] Error stack:', error?.stack);
    console.error('[LOGIN] Error name:', error?.name);
    
    // Provide more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || 'Something went wrong while signing in.'
      : 'Something went wrong while signing in.';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error?.stack })
      },
      { status: 500 }
    );
  }
}

