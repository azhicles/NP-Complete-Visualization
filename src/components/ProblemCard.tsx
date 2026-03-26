import { Link } from 'react-router-dom'
import type { Problem } from '../data/problems'

interface Props {
  problem: Problem
}

export default function ProblemCard({ problem }: Props) {
  return (
    <Link to={`/problem/${problem.id}`} className="card-link">
      <article className="problem-card">
        <p className="problem-card-category">{problem.category}</p>
        <h3 className="problem-card-name">{problem.name}</h3>
        <p className="problem-card-desc">{problem.informalDescription}</p>
        <div className="tag-list">
          {problem.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </article>
    </Link>
  )
}
