import { NextRequest, NextResponse } from 'next/server';
import { getVerbConjugations } from '@/lib/db/verbs';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const verb = searchParams.get('verb');

  if (!verb) {
    return NextResponse.json(
      { error: 'Verb parameter is required' },
      { status: 400 }
    );
  }

  try {
    const conjugations = await getVerbConjugations(verb);
    return NextResponse.json({ conjugations });
  } catch (error) {
    console.error('Failed to get conjugations:', error);
    return NextResponse.json(
      { error: 'Failed to get conjugations' },
      { status: 500 }
    );
  }
} 