'use client';

import { useState, useEffect } from 'react';

export default function BooksPage() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/books?q=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then(setBooks);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Buscar Livros</h1>
      <input
        type="text"
        placeholder="Digite o nome do livro..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '100%',
          margin: '1rem 0',
          fontSize: '1rem',
        }}
      />
      <ul>
        {books.map((book) => (
          <li key={book.id} style={{ marginBottom: '0.5rem' }}>
            📘 {book.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
