import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProblemPage from '../pages/ProblemPage'

function renderProblem(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/problem/${id}`]}>
      <Routes>
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/problems" element={<div>Problems page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProblemPage', () => {
  it('renders the SAT problem page', () => {
    renderProblem('sat')
    expect(screen.getByRole('heading', { name: 'Boolean Satisfiability Problem' })).toBeInTheDocument()
  })

  it('shows the formal definition', () => {
    renderProblem('sat')
    expect(screen.getByText(/Boolean formula/)).toBeInTheDocument()
  })

  it('shows references', () => {
    renderProblem('sat')
    // The reference link contains "Cook (1971)"
    const refLinks = screen.getAllByText(/Cook/)
    expect(refLinks.length).toBeGreaterThan(0)
  })

  it('shows applications', () => {
    renderProblem('sat')
    expect(screen.getByText(/Circuit design verification/i)).toBeInTheDocument()
  })

  it('redirects to /problems for unknown problem id', () => {
    renderProblem('nonexistent-problem-xyz')
    expect(screen.getByText('Problems page')).toBeInTheDocument()
  })

  it('renders breadcrumb navigation', () => {
    renderProblem('tsp')
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('shows reduction info for 3SAT', () => {
    renderProblem('3sat')
    expect(screen.getByText(/Hardness proved by reduction from/i)).toBeInTheDocument()
  })
})
