

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://n23yas9vs3.execute-api.us-east-1.amazonaws.com/Prod/players/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
     
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from external API:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
