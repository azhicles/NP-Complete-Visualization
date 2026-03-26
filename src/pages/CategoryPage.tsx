import { useParams, Link, Navigate } from 'react-router-dom'
import { categories, getProblemsByCategory } from '../data/problems'
import ProblemCard from '../components/ProblemCard'
import type { Category } from '../data/problems'

const CATEGORY_ICONS: Record<string, string> = {
  'Graph Theory':         '⬡',
  'Satisfiability':       '⊨',
  'Scheduling & Packing': '▦',
  'Number Theory':        '∑',
  'Set & Covering':       '∪',
  'Network Flow':         '⇝',
  'Sequencing':           '≡',
  'Geometry':             '△',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Graph Theory': 'Problems defined on graphs: vertices, edges, cycles, colorings, and connectivity. Graph-theoretic NP-complete problems are among the most studied, with applications from social networks to VLSI design.',
  'Satisfiability': 'Problems asking whether logical formulas can be made true by some assignment. SAT and its variants are the canonical NP-complete problems, central to verification, AI planning, and cryptography.',
  'Scheduling & Packing': 'Allocation of resources, tasks, or items under constraints. These problems arise in manufacturing, operations research, cloud computing, and combinatorial optimisation.',
  'Number Theory': 'Problems involving integer properties, sums, and partitions. Often weakly NP-complete — admitting pseudo-polynomial solutions — but lacking truly polynomial algorithms.',
  'Set & Covering': 'Problems about selecting subsets to cover, hit, or partition a universe. Arise in sensor placement, facility location, and test-suite minimisation.',
  'Network Flow': 'Problems on flow and connectivity in networks. While max-flow is polynomial, many variants with constraints become NP-complete.',
  'Sequencing': 'Ordering and arrangement problems. Sequence alignment, bandwidth, and similar problems require finding optimal orderings over combinatorial spaces.',
  'Geometry': 'Problems defined in geometric settings. Geometric NP-complete problems arise in robotics, computer graphics, and geographic information systems.',
}

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>()
  const decoded = decodeURIComponent(name ?? '') as Category

  if (!categories.includes(decoded)) return <Navigate to="/problems" replace />

  const probs = getProblemsByCategory(decoded)

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to="/problems">Problems</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">{decoded}</span>
      </nav>

      <header className="category-header">
        <span className="category-icon" aria-hidden="true">{CATEGORY_ICONS[decoded] ?? '◆'}</span>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>{decoded}</h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.95rem' }}>
            {probs.length} problem{probs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      {CATEGORY_DESCRIPTIONS[decoded] && (
        <p style={{ color: 'var(--ink-muted)', maxWidth: '680px', marginBottom: '2rem', lineHeight: 1.7 }}>
          {CATEGORY_DESCRIPTIONS[decoded]}
        </p>
      )}

      <div className="problem-grid">
        {probs.map(p => <ProblemCard key={p.id} problem={p} />)}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <Link to="/problems" className="btn btn-secondary">← All problems</Link>
      </div>
    </>
  )
}
