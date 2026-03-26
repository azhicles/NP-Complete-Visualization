import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProblemPage from './pages/ProblemPage'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import AllProblemsPage from './pages/AllProblemsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="problem/:id" element={<ProblemPage />} />
          <Route path="category/:name" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="problems" element={<AllProblemsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
