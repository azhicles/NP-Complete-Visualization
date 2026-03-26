import { useParams, Link, Navigate } from 'react-router-dom'
import { getProblemById, problems } from '../data/problems'
import ReductionGraph from '../components/ReductionGraph'
import AlgorithmDiagram from '../components/AlgorithmDiagram'

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>()
  const problem = getProblemById(id ?? '')

  if (!problem) return <Navigate to="/problems" replace />

  const reducedFrom = problem.reductionFrom ? getProblemById(problem.reductionFrom) : undefined
  const reducesTo = (problem.reducesTo ?? []).map(tid => getProblemById(tid)).filter(Boolean)

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to="/problems">Problems</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <Link to={`/category/${encodeURIComponent(problem.category)}`}>{problem.category}</Link>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">{problem.shortName}</span>
      </nav>

      <div className="problem-detail">
        {/* Main column */}
        <article className="problem-main">
          <header className="problem-header">
            <p className="problem-eyebrow">{problem.category}</p>
            <h1 className="problem-title">{problem.name}</h1>
            <p className="problem-complexity">{problem.complexity}</p>
            <div className="tag-list">
              {problem.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </header>

          {/* Overview */}
          <section className="content-section" aria-labelledby={`${problem.id}-overview`}>
            <h3 id={`${problem.id}-overview`}>Overview</h3>
            <p>{problem.informalDescription}</p>
          </section>

          {/* Formal definition */}
          <section className="content-section" aria-labelledby={`${problem.id}-def`}>
            <h3 id={`${problem.id}-def`}>Formal Definition</h3>
            <div className="definition-block" role="note">
              {problem.formalDefinition}
            </div>
          </section>

          {/* Example */}
          <section className="content-section" aria-labelledby={`${problem.id}-ex`}>
            <h3 id={`${problem.id}-ex`}>Example</h3>
            <p style={{ fontStyle: 'italic', color: 'var(--ink-muted)' }}>{problem.example}</p>
          </section>

          {/* Why hard */}
          <section className="content-section" aria-labelledby={`${problem.id}-hard`}>
            <h3 id={`${problem.id}-hard`}>Why is it Hard?</h3>
            <p>{problem.whyHard}</p>
          </section>

          {/* Algorithm */}
          <section className="content-section" aria-labelledby={`${problem.id}-algo`}>
            <h3 id={`${problem.id}-algo`}>Algorithm Strategies</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <AlgorithmDiagram steps={problem.algorithmSteps} />
            </div>
            <ol className="algo-steps">
              {problem.algorithmSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {/* Applications */}
          <section className="content-section" aria-labelledby={`${problem.id}-apps`}>
            <h3 id={`${problem.id}-apps`}>Applications</h3>
            <ul className="applications-list">
              {problem.applications.map((app, i) => (
                <li key={i}>{app}</li>
              ))}
            </ul>
          </section>

          {/* References */}
          <section className="content-section" aria-labelledby={`${problem.id}-refs`}>
            <h3 id={`${problem.id}-refs`}>References &amp; Further Reading</h3>
            <ul className="reference-list" role="list">
              {problem.references.map((ref, i) => (
                <li key={i} className="reference-item">
                  <span className={`ref-type-badge ref-type-${ref.type}`}>{ref.type}</span>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="problem-sidebar" aria-label="Problem relationships">
          {/* Reduction graph highlight */}
          <div className="reduction-box">
            <h4>Reduction Graph</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '0.75rem' }}>
              This problem is highlighted in the global reduction network.
            </p>
            <ReductionGraph height={260} highlightId={problem.id} />
          </div>

          {/* Reductions */}
          <div className="reduction-box">
            <h4>Reductions</h4>

            {reducedFrom && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>
                  Hardness proved by reduction from:
                </p>
                <Link to={`/problem/${reducedFrom.id}`} className="reduction-link">
                  <span className="reduction-arrow">←</span>
                  {reducedFrom.name}
                </Link>
              </div>
            )}

            {reducesTo.length > 0 && (
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>
                  This problem reduces to:
                </p>
                {reducesTo.map(p => p && (
                  <Link key={p.id} to={`/problem/${p.id}`} className="reduction-link">
                    <span className="reduction-arrow">→</span>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}

            {!reducedFrom && reducesTo.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
                No direct reductions documented here.
              </p>
            )}
          </div>

          {/* Related problems (same category) */}
          <div className="reduction-box">
            <h4>Same Category</h4>
            {problems
              .filter(p => p.category === problem.category && p.id !== problem.id)
              .slice(0, 6)
              .map(p => (
                <Link key={p.id} to={`/problem/${p.id}`} className="reduction-link">
                  {p.shortName}
                </Link>
              ))}
          </div>
        </aside>
      </div>
    </>
  )
}
