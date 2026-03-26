import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AllProblemsPage from '../pages/AllProblemsPage'
import { problems } from '../data/problems'

function renderPage() {
  return render(
    <MemoryRouter>
      <AllProblemsPage />
    </MemoryRouter>
  )
}

describe('AllProblemsPage', () => {
  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /All NP-Complete Problems/i })).toBeInTheDocument()
  })

  it('shows all problems in the table by default', () => {
    renderPage()
    expect(screen.getByText(`Showing ${problems.length} of ${problems.length} problems`)).toBeInTheDocument()
  })

  it('filters by category when a category button is clicked', () => {
    renderPage()
    const graphBtn = screen.getByRole('button', { name: 'Graph Theory' })
    fireEvent.click(graphBtn)
    // After filtering, count should be less than total
    const countText = screen.getByText(/Showing \d+ of \d+ problems/)
    const match = countText.textContent?.match(/Showing (\d+)/)
    expect(Number(match?.[1])).toBeLessThan(problems.length)
  })

  it('sorts by name when Name column header is clicked', () => {
    renderPage()
    const nameHeader = screen.getByRole('columnheader', { name: /Problem/ })
    // Initial state is name asc (↑). One click toggles to desc (↓).
    fireEvent.click(nameHeader)
    expect(nameHeader.textContent).toContain('↓')
  })

  it('renders links to individual problem pages', () => {
    renderPage()
    const satLink = screen.getByRole('link', { name: 'Boolean Satisfiability Problem' })
    expect(satLink).toHaveAttribute('href', '/problem/sat')
  })
})
