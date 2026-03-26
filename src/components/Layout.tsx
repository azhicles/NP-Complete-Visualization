import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'

export default function Layout() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <div className="layout">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="site-logo">
            <span className="logo-np">NP</span>-Complete
          </NavLink>
          <nav className="site-nav" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/problems" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              All Problems
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Search
            </NavLink>
          </nav>
          <form className="nav-search" onSubmit={handleSearch} role="search">
            <input
              className="header-search-input"
              type="search"
              placeholder="Search problems…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search NP-complete problems"
            />
          </form>
        </div>
      </header>

      <main className="main-content">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <p>
          NP-Complete Visualizer — A reference for polynomial reductions and computational complexity.
          Problems sourced from Karp (1972) and Garey &amp; Johnson (1979).
        </p>
      </footer>
    </div>
  )
}
