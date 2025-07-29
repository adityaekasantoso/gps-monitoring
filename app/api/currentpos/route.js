// file: /app/api/currentpos/route.ts
import { NextResponse } from 'next/server';
import http from 'http';

export async function GET() {
  const url = 'http://202.150.138.43:8080/currentpos';

  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(
          new NextResponse(data, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
          })
        );
      });
    }).on('error', () => {
      resolve(
        new NextResponse(JSON.stringify({ error: 'Gagal mengambil data' }), {
          status: 500,
        })
      );
    });
  });
}