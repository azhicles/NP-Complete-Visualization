import { Link } from 'react-router-dom'
import { problems, categories, getProblemsByCategory } from '../data/problems'
import ProblemCard from '../components/ProblemCard'
import ReductionGraph from '../components/ReductionGraph'

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

const FEATURED_IDS = ['sat', '3sat', 'tsp', 'clique', 'vertex-cover', 'subset-sum']

export default function HomePage() {
  const featured = problems.filter(p => FEATURED_IDS.includes(p.id))

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-eyebrow">Computational Complexity Reference</p>
        <h1 className="hero-title" id="hero-title">
          NP-Complete Problems,<br />Visualised
        </h1>
        <p className="hero-lead">
          An encyclopaedia of NP-complete problems: formal definitions, informal intuitions,
          polynomial reductions, algorithm strategies, and links to primary literature —
          all in one navigable reference.
        </p>
        <div className="hero-actions">
          <Link to="/problems" className="btn btn-primary">Browse all problems</Link>
          <Link to="/search" className="btn btn-secondary">Search</Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-row" role="region" aria-label="Statistics">
        <div className="stat-item">
          <span className="stat-number">{problems.length}</span>
          <span className="stat-label">NP-complete problems</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{categories.length}</span>
          <span className="stat-label">categories</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {problems.reduce((acc, p) => acc + (p.reducesTo?.length ?? 0), 0)}
          </span>
          <span className="stat-label">documented reductions</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">1971</span>
          <span className="stat-label">Cook–Levin theorem year</span>
        </div>
      </div>

      {/* ── Reduction Graph ── */}
      <section aria-labelledby="graph-heading" style={{ marginBottom: '3rem' }}>
        <div className="section-heading">
          <h2 id="graph-heading">Reduction Graph</h2>
          <span className="ornament" />
        </div>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          Arrows denote polynomial reductions (A → B means A reduces to B, proving B at least as hard).
          Drag nodes, scroll to zoom, click a node to open its problem page.
        </p>
        <ReductionGraph height={520} />
      </section>

      {/* ── Categories ── */}
      <section aria-labelledby="cat-heading" style={{ marginBottom: '3rem' }}>
        <div className="section-heading">
          <h2 id="cat-heading">Browse by Category</h2>
          <span className="ornament" />
        </div>
        <div className="category-grid">
          {categories.map(cat => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className="category-card"
            >
              <span className="category-card-icon" aria-hidden="true">{CATEGORY_ICONS[cat] ?? '◆'}</span>
              <span className="category-card-name">{cat}</span>
              <span className="category-card-count">
                {getProblemsByCategory(cat).length} problem{getProblemsByCategory(cat).length !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured problems ── */}
      <section aria-labelledby="featured-heading" style={{ marginBottom: '3rem' }}>
        <div className="section-heading">
          <h2 id="featured-heading">Landmark Problems</h2>
          <span className="ornament" />
        </div>
        <p style={{ color: 'var(--ink-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          The problems most central to the theory — starting points for the majority of NP-completeness proofs.
        </p>
        <div className="problem-grid">
          {featured.map(p => <ProblemCard key={p.id} problem={p} />)}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/problems" className="btn btn-secondary">View all {problems.length} problems →</Link>
        </div>
      </section>

      {/* ── About NP-completeness ── */}
      <section
        aria-labelledby="about-heading"
        className="card"
        style={{ marginBottom: '3rem', maxWidth: '760px' }}
      >
        <h2 id="about-heading" style={{ marginBottom: '0.75rem' }}>What is NP-completeness?</h2>
        <div className="section-divider" />
        <p>
          A problem is <strong>NP-complete</strong> if it is in NP (solutions can be verified in polynomial time)
          and is NP-hard (every problem in NP can be reduced to it in polynomial time). Stephen Cook and Leonid
          Levin independently proved in 1971–1973 that Boolean Satisfiability (SAT) is NP-complete, giving us
          the first such problem.
        </p>
        <p>
          Richard Karp then showed in 1972 that 21 natural combinatorial problems — including Clique, Vertex
          Cover, and the Travelling Salesman Problem — are all NP-complete via polynomial reductions. Today
          thousands of NP-complete problems are known across graph theory, logic, scheduling, number theory,
          and geometry.
        </p>
        <p style={{ marginBottom: 0 }}>
          The <strong>P vs NP question</strong> — whether every NP problem can be solved in polynomial time — is
          the most famous open problem in computer science and mathematics, listed as one of the Clay Millennium
          Prize Problems (prize: US$1,000,000).
        </p>
      </section>
    </>
  )
}
