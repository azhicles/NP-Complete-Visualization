import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchPage from '../pages/SearchPage'

function renderPage(initialSearch = '') {
  return render(
    <MemoryRouter initialEntries={[`/search${initialSearch}`]}>
      <SearchPage />
    </MemoryRouter>
  )
}

describe('SearchPage', () => {
  it('renders search input', () => {
    renderPage()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('shows suggestions when empty', () => {
    renderPage()
    expect(screen.getByText(/Try searching for/i)).toBeInTheDocument()
  })

  it('shows results after typing', async () => {
    renderPage()
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'clique' } })
    await waitFor(() => {
      expect(screen.getByText(/result/i)).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('shows no-results message for gibberish query', async () => {
    renderPage()
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'zzznomatch' } })
    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument()
    }, { timeout: 500 })
  })

  it('pre-fills query from URL param', () => {
    renderPage('?q=sat')
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('sat')
  })
})
