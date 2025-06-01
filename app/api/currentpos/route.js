import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://202.150.138.43:8080/currentpos');
    const data = await res.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Gagal mengambil data' }), {
      status: 500,
    });
  }
}
