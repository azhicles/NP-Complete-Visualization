import { describe, it, expect } from 'vitest'
import {
  problems,
  categories,
  allTags,
  getProblemById,
  getProblemsByCategory,
  getProblemsByTag,
  searchProblems,
  reductions,
} from '../data/problems'

describe('problems data', () => {
  it('exports a non-empty array of problems', () => {
    expect(problems.length).toBeGreaterThanOrEqual(20)
  })

  it('every problem has required fields', () => {
    problems.forEach(p => {
      expect(p.id, `${p.id} missing id`).toBeTruthy()
      expect(p.name, `${p.id} missing name`).toBeTruthy()
      expect(p.shortName, `${p.id} missing shortName`).toBeTruthy()
      expect(p.category, `${p.id} missing category`).toBeTruthy()
      expect(p.tags.length, `${p.id} has no tags`).toBeGreaterThan(0)
      expect(p.formalDefinition, `${p.id} missing formalDefinition`).toBeTruthy()
      expect(p.informalDescription, `${p.id} missing informalDescription`).toBeTruthy()
      expect(p.example, `${p.id} missing example`).toBeTruthy()
      expect(p.whyHard, `${p.id} missing whyHard`).toBeTruthy()
      expect(p.applications.length, `${p.id} has no applications`).toBeGreaterThan(0)
      expect(p.references.length, `${p.id} has no references`).toBeGreaterThan(0)
      expect(p.algorithmSteps.length, `${p.id} has no algorithmSteps`).toBeGreaterThan(0)
    })
  })

  it('all problem ids are unique', () => {
    const ids = problems.map(p => p.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('includes landmark problems', () => {
    const ids = problems.map(p => p.id)
    expect(ids).toContain('sat')
    expect(ids).toContain('3sat')
    expect(ids).toContain('clique')
    expect(ids).toContain('tsp')
    expect(ids).toContain('vertex-cover')
    expect(ids).toContain('subset-sum')
    expect(ids).toContain('graph-coloring')
    expect(ids).toContain('hamiltonian-cycle')
  })

  it('exports non-empty categories', () => {
    expect(categories.length).toBeGreaterThan(0)
  })

  it('exports non-empty allTags', () => {
    expect(allTags.length).toBeGreaterThan(0)
  })
})

describe('getProblemById', () => {
  it('returns the correct problem', () => {
    const p = getProblemById('sat')
    expect(p).toBeDefined()
    expect(p?.name).toBe('Boolean Satisfiability Problem')
  })

  it('returns undefined for unknown id', () => {
    expect(getProblemById('nonexistent')).toBeUndefined()
  })
})

describe('getProblemsByCategory', () => {
  it('returns only problems with the requested category', () => {
    const graphProblems = getProblemsByCategory('Graph Theory')
    expect(graphProblems.length).toBeGreaterThan(0)
    graphProblems.forEach(p => expect(p.category).toBe('Graph Theory'))
  })
})

describe('getProblemsByTag', () => {
  it('returns only problems with the requested tag', () => {
    const classics = getProblemsByTag('classic')
    expect(classics.length).toBeGreaterThan(0)
    classics.forEach(p => expect(p.tags).toContain('classic'))
  })
})

describe('searchProblems', () => {
  it('finds problems by name', () => {
    const results = searchProblems('clique')
    expect(results.some(p => p.id === 'clique')).toBe(true)
  })

  it('finds problems by category', () => {
    const results = searchProblems('Satisfiability')
    expect(results.length).toBeGreaterThan(0)
  })

  it('finds problems by tag', () => {
    const results = searchProblems('graph')
    expect(results.length).toBeGreaterThan(0)
  })

  it('is case-insensitive', () => {
    const lower = searchProblems('sat')
    const upper = searchProblems('SAT')
    expect(lower.length).toBe(upper.length)
  })

  it('returns empty array for no match', () => {
    expect(searchProblems('zzznomatchxxx')).toHaveLength(0)
  })
})

describe('reductions', () => {
  it('exports a non-empty reductions array', () => {
    expect(reductions.length).toBeGreaterThan(0)
  })

  it('every reduction references valid problem ids', () => {
    const ids = new Set(problems.map(p => p.id))
    reductions.forEach(r => {
      expect(ids.has(r.from), `reduction 'from' id "${r.from}" not found`).toBe(true)
      expect(ids.has(r.to), `reduction 'to' id "${r.to}" not found`).toBe(true)
    })
  })

  it('SAT reduces to 3SAT', () => {
    expect(reductions.some(r => r.from === 'sat' && r.to === '3sat')).toBe(true)
  })

  it('3SAT reduces to clique', () => {
    expect(reductions.some(r => r.from === '3sat' && r.to === 'clique')).toBe(true)
  })

  it('hamiltonian-cycle reduces to tsp', () => {
    expect(reductions.some(r => r.from === 'hamiltonian-cycle' && r.to === 'tsp')).toBe(true)
  })
})
