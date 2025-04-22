'use client';
import { useState, useEffect } from 'react';

export default function VersesPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Atualiza o valor do input e trata sugestões
  const handleInputChange = async (value) => {
    setQuery(value);

    const parts = value.trim().split(/\s+/);
    const firstWord = parts[0];

    // Só mostra sugestões se estiver no primeiro "token" (nome do livro)
    if (parts.length === 1 && firstWord.length > 0) {
      const res = await fetch(`/api/books?q=${encodeURIComponent(firstWord)}`);
      const data = await res.json();
      setSuggestions(data.map(b => b.name));
    } else {
      setSuggestions([]); // Oculta sugestões se já tiver capítulo ou versículo
    }
  };

  // Atualiza os versículos de forma reativa
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      fetch(`/api/verses?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  // Ao clicar em uma sugestão de livro
  const handleSuggestionClick = (book) => {
    const rest = query.split(/\s+/).slice(1).join(' ');
    setQuery(`${book} ${rest}`.trim());
    setSuggestions([]);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar Versículos</h1>

      <input
        type="text"
        placeholder="Ex: joao 5 10-14"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border rounded mb-4 shadow">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((v, i) => (
            <div key={i} className="p-2 border rounded">
              <strong>{v.chapter}:{v.verse}</strong> - {v.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
