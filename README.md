# NP-Complete Visualization

An interactive React + TypeScript reference for NP-complete problems.

The app presents classic NP-complete problems with:

- formal definitions and plain-language intuition
- example instances and "why this is hard" context
- algorithm strategy outlines
- references for further reading
- a reduction graph to explore relationships between problems

## Tech stack

- React 18
- TypeScript
- Vite
- React Router
- D3 (for graph visualizations)
- Vitest + Testing Library

## Getting started

From the repository root:

```bash
npm ci
npm run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Available scripts

- `npm run dev` - start the local development server
- `npm run build` - type-check and create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm test` - run tests once with Vitest
- `npm run test:watch` - run tests in watch mode
- `npm run coverage` - run tests with coverage output
