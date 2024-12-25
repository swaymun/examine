import { NextResponse } from 'next/server';
import { getAllVerbInfinitives } from '@/lib/db/verbs';

export async function GET() {
  try {
    const verbs = await getAllVerbInfinitives();
    return NextResponse.json({ verbs });
  } catch (error) {
    console.error('Failed to fetch verbs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verbs' },
      { status: 500 }
    );
  }
} 