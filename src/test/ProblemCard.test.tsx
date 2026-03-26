import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProblemCard from '../components/ProblemCard'
import { getProblemById } from '../data/problems'

const satProblem = getProblemById('sat')!

describe('ProblemCard', () => {
  function renderCard() {
    return render(
      <MemoryRouter>
        <ProblemCard problem={satProblem} />
      </MemoryRouter>
    )
  }

  it('renders the problem name', () => {
    renderCard()
    expect(screen.getByText('Boolean Satisfiability Problem')).toBeInTheDocument()
  })

  it('renders the problem category', () => {
    renderCard()
    expect(screen.getByText('Satisfiability')).toBeInTheDocument()
  })

  it('renders tags', () => {
    renderCard()
    expect(screen.getByText('boolean')).toBeInTheDocument()
    expect(screen.getByText('classic')).toBeInTheDocument()
  })

  it('is wrapped in a link pointing to the correct problem page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/problem/sat')
  })
})

describe('ProblemCard with different problem', () => {
  it('renders TSP correctly', () => {
    const tsp = getProblemById('tsp')!
    render(
      <MemoryRouter>
        <ProblemCard problem={tsp} />
      </MemoryRouter>
    )
    expect(screen.getByText('Travelling Salesman Problem')).toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/problem/tsp')
  })
})
