import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';

function normalize(str) {
  return str
    .normalize('NFD')               // separa letras e acentos
    .replace(/[\u0300-\u036f]/g, '') // remove os acentos
    .toLowerCase();                  // converte tudo pra minúsculo
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  const stmt = db.prepare('SELECT id, name FROM book');
  const allBooks = stmt.all();

  const filtered = allBooks.filter(book =>
    normalize(book.name).startsWith(normalize(query))
  );

  return NextResponse.json(filtered);
}
