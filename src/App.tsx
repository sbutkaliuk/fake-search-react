import { useState } from "react";
import "./App.css";
import { BOOK_DB } from "./data";

type SearchResult = any[];

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    setError("");
    setLoading(true);

    fakeSearch(value)
      .then((res) => {
        setResults(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong.");
        setLoading(false);
      });
  };

  return (
    <div className="container" style={{ maxWidth: '720px', marginTop: '2rem', marginBottom: '2rem' }}>
      <h2 className="mb-3">Book Search</h2>

      <input
        type="text"
        className="form-control form-control-lg"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search books by name, ISBN, or author"
        autoComplete="off"
      />

      <div className="text-muted small mt-2"></div>

      {loading && (
        <div className="badge bg-info mt-3">Loading…</div>
      )}

      {error && (
        <div className="alert alert-danger mt-3 mb-0">{error}</div>
      )}

      <div className="border rounded mt-4">
        {results.map((book: any, index: number) => (
          <div
            key={book.id}
            className={`d-flex justify-content-between align-items-center p-3 border-bottom${
              index === results.length - 1 ? ' border-bottom-0' : ''
            }`}
          >
            <div className="flex-grow-1">
              <strong className="d-block">{book.name}</strong>
              <small className="text-muted">{book.author}</small>
            </div>
            <span className="badge bg-secondary ms-3">{book.isbn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function fakeSearch(q: string): Promise<SearchResult> {
  const latency = 150 + Math.floor(Math.random() * 900); // 150–1050ms
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error("Random hiccup"));
        return;
      }

      const query = q.trim().toLowerCase();
      console.log("API CALL with query - ", query);

      const filtered = BOOK_DB.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.isbn.toLowerCase().includes(query) ||
          c.author.toLowerCase().includes(query),
      ).slice(0, 6); // Max 6 results

      resolve(filtered);
    }, latency);
  });
}

export default App;
