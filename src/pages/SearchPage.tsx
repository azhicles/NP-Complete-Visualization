import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchProblems } from '../data/problems'
import ProblemCard from '../components/ProblemCard'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initial)
  const [debouncedQuery, setDebouncedQuery] = useState(initial)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query)
      if (query.trim()) {
        setSearchParams({ q: query.trim() }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    }, 200)
    return () => clearTimeout(t)
  }, [query, setSearchParams])

  const results = debouncedQuery.trim() ? searchProblems(debouncedQuery) : []

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">Search</span>
      </nav>

      <h1 style={{ marginBottom: '1.5rem' }}>Search Problems</h1>

      <div className="search-bar-large" role="search">
        <input
          className="search-input-large"
          type="search"
          autoFocus
          placeholder="Search by name, category, tag, or description…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search NP-complete problems"
        />
      </div>

      {debouncedQuery.trim() ? (
        <>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for <em>"{debouncedQuery}"</em>
          </p>
          {results.length > 0 ? (
            <div className="problem-grid">
              {results.map(p => <ProblemCard key={p.id} problem={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">🔍</div>
              <h3>No results found</h3>
              <p>Try a different term — problem name, category, or tag.</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>
          <p>Try searching for: <em>graph</em>, <em>satisfiability</em>, <em>scheduling</em>, <em>clique</em>, <em>SAT</em>…</p>
        </div>
      )}
    </>
  )
}
