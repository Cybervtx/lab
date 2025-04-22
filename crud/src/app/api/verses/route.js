import { NextResponse } from 'next/server';
import db from '@/lib/sqlite';

// Função de normalização para comparação de nomes
function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

// Função para interpretar a string (ex: 'joao 5 10-24')
function parseInput(input) {
  const parts = input.trim().split(/\s+/); // separa por espaço
  if (parts.length < 3) return null;

  const bookName = parts[0];
  const chapter = parseInt(parts[1]);
  const [start, end] = parts[2].split('-').map(Number);

  return {
    bookName: normalize(bookName),
    chapter,
    start,
    end: end || start,
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const parsed = parseInput(q);

  if (!parsed) return NextResponse.json([]);

  const { bookName, chapter, start, end } = parsed;

  // Buscar ID do livro
  const books = db.prepare('SELECT id, name FROM book').all();
  const book = books.find(b => normalize(b.name) === bookName);
  if (!book) return NextResponse.json([]);

  // Buscar versículos
  const stmt = db.prepare(`
    SELECT chapter, verse, text FROM verse
    WHERE book_id = ?
      AND chapter = ?
      AND verse BETWEEN ? AND ?
    ORDER BY verse
  `);
  const verses = stmt.all(book.id, chapter, start, end);

  return NextResponse.json(verses);
}
