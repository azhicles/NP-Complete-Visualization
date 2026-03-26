import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { problems, categories, allTags } from '../data/problems'
import type { Category, Tag } from '../data/problems'

type SortKey = 'name' | 'category'

export default function AllProblemsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [sort, setSort] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    let list = problems
    if (activeCategory) list = list.filter(p => p.category === activeCategory)
    if (activeTag) list = list.filter(p => p.tags.includes(activeTag))
    list = [...list].sort((a, b) => {
      const va = a[sort]
      const vb = b[sort]
      return sortDir === 'asc'
        ? va.localeCompare(vb)
        : vb.localeCompare(va)
    })
    return list
  }, [activeCategory, activeTag, sort, sortDir])

  function toggleSort(key: SortKey) {
    if (sort === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(key)
      setSortDir('asc')
    }
  }

  const sortIndicator = (key: SortKey) =>
    sort === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">All Problems</span>
      </nav>

      <h1 style={{ marginBottom: '1.5rem' }}>All NP-Complete Problems</h1>

      {/* Category filters */}
      <div className="filter-bar" role="group" aria-label="Filter by category">
        <label>Category:</label>
        <button
          className={`filter-btn${activeCategory === null ? ' active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div className="filter-bar" role="group" aria-label="Filter by tag">
        <label>Tag:</label>
        <button
          className={`filter-btn${activeTag === null ? ' active' : ''}`}
          onClick={() => setActiveTag(null)}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={`filter-btn${activeTag === tag ? ' active' : ''}`}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Showing {filtered.length} of {problems.length} problems
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="problems-table" aria-label="NP-complete problems">
          <thead>
            <tr>
              <th scope="col" onClick={() => toggleSort('name')}>
                Problem{sortIndicator('name')}
              </th>
              <th scope="col" onClick={() => toggleSort('category')}>
                Category{sortIndicator('category')}
              </th>
              <th scope="col">Tags</th>
              <th scope="col">Complexity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <Link to={`/problem/${p.id}`}>{p.name}</Link>
                </td>
                <td>
                  <Link
                    to={`/category/${encodeURIComponent(p.category)}`}
                    style={{ fontSize: '0.85rem', color: 'var(--accent)' }}
                  >
                    {p.category}
                  </Link>
                </td>
                <td>
                  <div className="tag-list" style={{ marginTop: 0 }}>
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                  {p.complexity.split('(')[0].trim()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
