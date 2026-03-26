export type Category =
  | 'Graph Theory'
  | 'Satisfiability'
  | 'Scheduling & Packing'
  | 'Number Theory'
  | 'Set & Covering'
  | 'Network Flow'
  | 'Sequencing'
  | 'Geometry';

export type Tag =
  | 'graph'
  | 'boolean'
  | 'optimization'
  | 'decision'
  | 'combinatorial'
  | 'classic'
  | 'approximable'
  | 'inapproximable'
  | 'planar'
  | 'counting'
  | 'geometric'
  | 'scheduling'
  | 'number'
  | 'packing'
  | 'covering';

export interface Reduction {
  from: string; // problem id
  to: string;   // problem id
  description: string;
}

export interface Reference {
  title: string;
  url: string;
  type: 'paper' | 'wiki' | 'book' | 'course';
}

export interface Problem {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  tags: Tag[];
  complexity: string;
  formalDefinition: string;
  informalDescription: string;
  example: string;
  whyHard: string;
  applications: string[];
  reductionFrom?: string; // problem id that reduces TO this one (proving hardness)
  reducesTo?: string[];   // problems this reduces to
  references: Reference[];
  algorithmSteps: string[];
}

export const problems: Problem[] = [
  {
    id: 'sat',
    name: 'Boolean Satisfiability Problem',
    shortName: 'SAT',
    category: 'Satisfiability',
    tags: ['boolean', 'classic', 'decision'],
    complexity: 'NP-complete (Cook–Levin Theorem, 1971)',
    formalDefinition:
      'Given a Boolean formula φ over variables x₁, …, xₙ, does there exist an assignment of truth values to the variables such that φ evaluates to TRUE?',
    informalDescription:
      'SAT asks whether we can set a collection of true/false switches so that a logical expression becomes true. It is the foundational NP-complete problem — every NP problem reduces to SAT.',
    example:
      '(x₁ ∨ ¬x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂) ∧ (¬x₃) is satisfied by x₁=T, x₂=T, x₃=F.',
    whyHard:
      'With n variables there are 2ⁿ possible assignments. No known algorithm does better than exhaustive search in the worst case, though DPLL/CDCL solvers are remarkably efficient in practice.',
    applications: ['Circuit design verification', 'AI planning', 'Hardware model checking', 'Cryptanalysis', 'Constraint solving'],
    reducesTo: ['3sat', 'clique', 'graph-coloring'],
    references: [
      { title: 'Cook (1971) — The complexity of theorem-proving procedures', url: 'https://dl.acm.org/doi/10.1145/800157.805047', type: 'paper' },
      { title: 'Wikipedia — Boolean satisfiability problem', url: 'https://en.wikipedia.org/wiki/Boolean_satisfiability_problem', type: 'wiki' },
      { title: 'MiniSat solver', url: 'http://minisat.se/', type: 'course' },
    ],
    algorithmSteps: [
      'Parse the formula into clauses (conjunctions of disjunctions).',
      'Apply unit propagation: if a clause has one literal, set it to TRUE.',
      'Apply pure-literal elimination: if a variable appears only positively, set it TRUE.',
      'If no conflict, pick an unassigned variable and branch (try TRUE then FALSE).',
      'Backtrack on conflict until all clauses satisfied or all branches exhausted.',
    ],
  },
  {
    id: '3sat',
    name: '3-Satisfiability',
    shortName: '3-SAT',
    category: 'Satisfiability',
    tags: ['boolean', 'classic', 'decision'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a Boolean formula in 3-CNF (each clause has exactly 3 literals), is it satisfiable?',
    informalDescription:
      '3-SAT is the restricted form of SAT where every clause has exactly three literals. It remains NP-complete and is one of the most common starting points for reductions.',
    example:
      '(x₁ ∨ x₂ ∨ x₃) ∧ (¬x₁ ∨ x₂ ∨ ¬x₃): set x₂=T to satisfy both clauses.',
    whyHard:
      '2-SAT is solvable in polynomial time (using SCC), but adding a third literal per clause makes the problem NP-complete. The reduction from general SAT introduces at most a linear blow-up.',
    applications: ['Hardness proofs', 'Combinatorial circuit testing', 'Automated theorem proving'],
    reductionFrom: 'sat',
    reducesTo: ['independent-set', 'clique', 'graph-coloring', 'vertex-cover', 'hamiltonian-cycle'],
    references: [
      { title: 'Wikipedia — 3-SAT', url: 'https://en.wikipedia.org/wiki/Boolean_satisfiability_problem#3-satisfiability', type: 'wiki' },
      { title: 'Sipser — Introduction to the Theory of Computation', url: 'https://www.cengage.com/c/introduction-to-the-theory-of-computation-3e-sipser/9781133187790/', type: 'book' },
    ],
    algorithmSteps: [
      'Convert general SAT to 3-CNF: split large clauses with fresh variables.',
      'Apply DPLL/CDCL with clause-learning heuristics.',
      'Use local search (WalkSAT) as a probabilistic alternative.',
      'Try random restarts with Luby restart strategy.',
    ],
  },
  {
    id: 'clique',
    name: 'Clique Problem',
    shortName: 'Clique',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'classic', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given an undirected graph G = (V, E) and integer k, does G contain a clique (complete subgraph) of size k?',
    informalDescription:
      'A clique is a group of vertices all mutually connected. The problem asks whether a social network contains a fully-interconnected group of k people.',
    example:
      'In a graph with 5 nodes forming a pentagon plus edges 1-3 and 2-4, finding a triangle (3-clique) requires checking all triples.',
    whyHard:
      'There are C(n,k) subsets of size k to check, which grows exponentially. No polynomial-time algorithm is known, and the problem is inapproximable within n^(1−ε) for any ε > 0 (assuming P ≠ NP).',
    applications: ['Social network analysis', 'Bioinformatics (protein interaction networks)', 'Market basket analysis', 'Fault-tolerant network design'],
    reductionFrom: '3sat',
    reducesTo: ['independent-set'],
    references: [
      { title: 'Wikipedia — Clique problem', url: 'https://en.wikipedia.org/wiki/Clique_problem', type: 'wiki' },
      { title: 'Garey & Johnson — Computers and Intractability', url: 'https://www.amazon.com/Computers-Intractability-NP-Completeness-Mathematical-Sciences/dp/0716710455', type: 'book' },
    ],
    algorithmSteps: [
      'Enumerate all subsets of size k: O(n^k) time.',
      'Greedy approximation: repeatedly add the vertex with most neighbors in remaining graph.',
      'Branch-and-bound with degree-ordering heuristics.',
      'For fixed k, check each k-subset in polynomial time.',
    ],
  },
  {
    id: 'independent-set',
    name: 'Independent Set',
    shortName: 'Ind. Set',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'classic', 'inapproximable'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given undirected graph G = (V, E) and integer k, does G contain an independent set of size ≥ k (a set of k vertices with no two adjacent)?',
    informalDescription:
      'An independent set is a group of vertices with no edges between them. It is complementary to the clique problem: a clique in G is an independent set in the complement of G.',
    example:
      'In a path graph 1–2–3–4–5, the set {1, 3, 5} is an independent set of size 3.',
    whyHard:
      'Inapproximable within n^(1−ε) unless P = NP. The complement graph duality to clique means both problems are equally hard.',
    applications: ['Wireless channel assignment', 'Register allocation in compilers', 'Scheduling non-conflicting tasks'],
    reductionFrom: 'clique',
    reducesTo: ['vertex-cover'],
    references: [
      { title: 'Wikipedia — Independent set (graph theory)', url: 'https://en.wikipedia.org/wiki/Independent_set_(graph_theory)', type: 'wiki' },
    ],
    algorithmSteps: [
      'Complement transformation: find clique in Ḡ.',
      'Dynamic programming on trees (polynomial for tree graphs).',
      'Branch-and-bound: exclude neighbors of selected vertices.',
      'For planar graphs: polynomial algorithm via separator theorem.',
    ],
  },
  {
    id: 'vertex-cover',
    name: 'Vertex Cover',
    shortName: 'Vertex Cover',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'classic', 'approximable', 'covering'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given undirected graph G = (V, E) and integer k, does G have a vertex cover of size ≤ k (a set S ⊆ V such that every edge has at least one endpoint in S)?',
    informalDescription:
      'A vertex cover "covers" all edges by including at least one endpoint. Admitting a 2-approximation (pick both endpoints of a maximal matching), it is one of the few NP-complete problems with a non-trivial constant-factor guarantee.',
    example:
      'In a star graph with centre c and leaves l₁…l₄, {c} is a vertex cover of size 1.',
    whyHard:
      'Equivalent to maximum independent set (V \\ cover is an independent set), inheriting its NP-hardness. No (2−ε)-approximation unless the Unique Games Conjecture fails.',
    applications: ['Network security (monitor nodes)', 'Computational biology', 'VLSI testing'],
    reductionFrom: 'independent-set',
    reducesTo: ['set-cover'],
    references: [
      { title: 'Wikipedia — Vertex cover', url: 'https://en.wikipedia.org/wiki/Vertex_cover', type: 'wiki' },
      { title: 'Parameterized Algorithms (Cygan et al.)', url: 'https://www.springer.com/gp/book/9783319212746', type: 'book' },
    ],
    algorithmSteps: [
      'Maximal matching 2-approximation: for each uncovered edge, add both endpoints.',
      'Kernelization: reduce to a kernel of size 2k in O(kn) time.',
      'FPT algorithm with O(2^k · k · n) using crown decomposition.',
      'Integer programming relaxation rounding.',
    ],
  },
  {
    id: 'graph-coloring',
    name: 'Graph Coloring',
    shortName: 'Graph Coloring',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'classic', 'combinatorial'],
    complexity: 'NP-complete (for k ≥ 3)',
    formalDefinition:
      'Given undirected graph G = (V, E) and integer k, can the vertices be colored with k colors such that no two adjacent vertices share the same color?',
    informalDescription:
      'Graph coloring generalizes map coloring. 2-coloring is equivalent to bipartiteness testing (polynomial), but 3-coloring is NP-complete. The chromatic number χ(G) is the minimum k required.',
    example:
      'A triangle K₃ requires exactly 3 colors. The Petersen graph requires 3 colors.',
    whyHard:
      'Inapproximable within n^(1−ε)/log^2(n) under plausible complexity assumptions. Even deciding if χ(G) ≤ 3 is NP-complete.',
    applications: ['Register allocation', 'Scheduling (assign time slots)', 'Frequency assignment in cellular networks', 'Map coloring'],
    reductionFrom: '3sat',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Graph coloring', url: 'https://en.wikipedia.org/wiki/Graph_coloring', type: 'wiki' },
      { title: 'Four color theorem (wiki)', url: 'https://en.wikipedia.org/wiki/Four_color_theorem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Greedy coloring: assign lowest available color to each vertex.',
      'DSATUR: choose next vertex by saturation degree (most uniquely colored neighbors).',
      'Backtracking with constraint propagation.',
      'Reduction from 3-SAT: gadget construction assigns colors corresponding to variable truth values.',
    ],
  },
  {
    id: 'hamiltonian-cycle',
    name: 'Hamiltonian Cycle',
    shortName: 'Ham. Cycle',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'classic', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given an undirected graph G = (V, E), does it contain a Hamiltonian cycle — a cycle that visits every vertex exactly once?',
    informalDescription:
      'A Hamiltonian cycle traverses every city exactly once and returns to the start. It is the decision version of the Travelling Salesman Problem.',
    example:
      'K₄ (complete graph on 4 vertices) has a Hamiltonian cycle: 1→2→3→4→1. A tree on ≥3 nodes has no Hamiltonian cycle.',
    whyHard:
      'Unlike Eulerian circuits (edge-traversal, poly-time), verifying the existence of a Hamiltonian cycle requires considering n! orderings. No structural shortcut analogous to the Euler condition is known.',
    applications: ['Route planning', 'DNA sequencing', 'Chip fabrication path planning', 'Knight\'s tour'],
    reductionFrom: '3sat',
    reducesTo: ['tsp'],
    references: [
      { title: 'Wikipedia — Hamiltonian path problem', url: 'https://en.wikipedia.org/wiki/Hamiltonian_path_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Held–Karp dynamic programming: O(n² · 2ⁿ) — exponential but structured.',
      'Ore\'s theorem: if deg(u)+deg(v) ≥ n for all non-adjacent u,v, a Hamiltonian cycle exists.',
      'Backtracking with pruning (remove dead-end vertices).',
      'Reduction to TSP with 0/1 edge weights.',
    ],
  },
  {
    id: 'tsp',
    name: 'Travelling Salesman Problem',
    shortName: 'TSP',
    category: 'Graph Theory',
    tags: ['graph', 'optimization', 'classic', 'approximable'],
    complexity: 'NP-complete (decision); NP-hard (optimisation)',
    formalDefinition:
      'Given n cities with pairwise distances d(i,j) and a budget B, is there a tour of all cities with total cost ≤ B?',
    informalDescription:
      'TSP asks for the shortest round trip through all cities. The metric version (triangle inequality) admits a 1.5-approximation (Christofides algorithm, 1976) and a recent 1.5−10⁻³⁶ improvement (ATSP, 2020).',
    example:
      'With cities A, B, C, D and symmetric distances, find the permutation minimising total travel distance.',
    whyHard:
      'Even with triangle inequality, inapproximable to within any constant factor for the general case. The decision version reduces from Hamiltonian cycle.',
    applications: ['Logistics and delivery routing', 'PCB drilling (minimise drill head travel)', 'Genome sequencing', 'Telescope scheduling'],
    reductionFrom: 'hamiltonian-cycle',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Travelling salesman problem', url: 'https://en.wikipedia.org/wiki/Travelling_salesman_problem', type: 'wiki' },
      { title: 'Christofides (1976) algorithm', url: 'https://en.wikipedia.org/wiki/Christofides_algorithm', type: 'wiki' },
      { title: 'Concorde TSP Solver', url: 'https://www.math.uwaterloo.ca/tsp/concorde.html', type: 'course' },
    ],
    algorithmSteps: [
      'Nearest-neighbour heuristic: always go to closest unvisited city.',
      'Christofides: compute MST, find min-weight perfect matching on odd-degree vertices, find Eulerian circuit, shortcut.',
      'Lin–Kernighan heuristic: swap tour edges to find improvements.',
      'Dynamic programming (Held–Karp): O(n² · 2ⁿ).',
    ],
  },
  {
    id: 'subset-sum',
    name: 'Subset Sum',
    shortName: 'Subset Sum',
    category: 'Number Theory',
    tags: ['number', 'decision', 'classic', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a set S of integers and a target t, does a subset of S sum exactly to t?',
    informalDescription:
      'Subset Sum asks whether we can select some numbers from a list to hit a precise target. It is a special case of the Knapsack problem and is weakly NP-complete (a pseudo-polynomial algorithm exists via dynamic programming).',
    example:
      'S = {3, 1, 4, 1, 5, 9, 2, 6}, t = 15. Select {1, 5, 9} or {4, 5, 6} to reach 15.',
    whyHard:
      'Although a DP approach runs in O(n·t) time — polynomial in numeric value — the input size is O(n log t) bits, making the algorithm pseudo-polynomial. No truly polynomial algorithm is known.',
    applications: ['Cryptographic key generation', 'Fair division', 'Resource allocation', 'Budgeting'],
    reductionFrom: '3sat',
    reducesTo: ['knapsack', 'partition'],
    references: [
      { title: 'Wikipedia — Subset sum problem', url: 'https://en.wikipedia.org/wiki/Subset_sum_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Dynamic programming: build boolean table dp[i][s] = can first i elements sum to s.',
      'Time: O(n·t), Space: O(n·t) — pseudo-polynomial.',
      'Meet-in-the-middle: split set in half, enumerate all subset sums for each half, check for matching pair. O(2^(n/2)).',
      'FPTAS: scale and round target for approximation scheme.',
    ],
  },
  {
    id: 'knapsack',
    name: 'Knapsack Problem',
    shortName: 'Knapsack',
    category: 'Scheduling & Packing',
    tags: ['optimization', 'decision', 'combinatorial', 'packing', 'approximable'],
    complexity: 'NP-complete (0/1 version)',
    formalDefinition:
      'Given n items with weights wᵢ and values vᵢ, a capacity W, and a target V, can we select items with total weight ≤ W and total value ≥ V?',
    informalDescription:
      'Knapsack models resource-constrained selection: pack the most valuable items without exceeding a weight limit. The fractional version is solvable greedily; the 0/1 version is NP-complete.',
    example:
      'Items: (w=2,v=6), (w=2,v=10), (w=3,v=12); W=5. Optimal: items 2 and 3 give value 22.',
    whyHard:
      'Like subset sum, the DP solution is pseudo-polynomial. An FPTAS achieves a (1−ε) approximation in O(n³/ε) time.',
    applications: ['Portfolio optimisation', 'Cargo loading', 'Memory allocation', 'Project selection under budget constraints'],
    reductionFrom: 'subset-sum',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Knapsack problem', url: 'https://en.wikipedia.org/wiki/Knapsack_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'DP: dp[i][w] = max value using first i items with capacity w. O(nW).',
      'Greedy fractional relaxation: sort by value/weight ratio.',
      'FPTAS: scale values by ε·max(v)/n, apply DP on scaled values.',
      'Branch and bound with LP relaxation upper bound.',
    ],
  },
  {
    id: 'partition',
    name: 'Partition Problem',
    shortName: 'Partition',
    category: 'Number Theory',
    tags: ['number', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a multiset S of positive integers, can S be partitioned into two subsets with equal sum?',
    informalDescription:
      'Partition is the "easiest" NP-complete problem in the sense that it has an FPTAS and a simple pseudo-polynomial DP. It arises in load balancing and fair division.',
    example:
      'S = {3, 1, 1, 2, 2, 1}. Sum = 10. Subsets {1, 2, 2} and {3, 1, 1} each sum to 5.',
    whyHard:
      'Equivalent to Subset Sum with target = (total sum)/2. Weakly NP-complete; the DP runs in O(n·sum) time.',
    applications: ['Job scheduling on two machines', 'Load balancing', 'Fair cake-cutting'],
    reductionFrom: 'subset-sum',
    reducesTo: ['bin-packing'],
    references: [
      { title: 'Wikipedia — Partition problem', url: 'https://en.wikipedia.org/wiki/Partition_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Reduce to Subset Sum with target = sum(S)/2.',
      'DP: O(n·sum) pseudo-polynomial solution.',
      'Greedy LPT (Longest Processing Time): assign each item to lighter subset.',
      'Karmarkar–Karp differencing heuristic for large instances.',
    ],
  },
  {
    id: 'bin-packing',
    name: 'Bin Packing',
    shortName: 'Bin Packing',
    category: 'Scheduling & Packing',
    tags: ['optimization', 'packing', 'combinatorial', 'approximable'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given items of sizes s₁,…,sₙ ∈ (0,1] and integer k, can all items be packed into at most k bins each of capacity 1?',
    informalDescription:
      'Bin Packing asks for the minimum number of fixed-capacity bins to hold all items. It models memory allocation, file backup, and container shipping.',
    example:
      'Items: 0.5, 0.7, 0.3, 0.8, 0.4, 0.1. Minimum 3 bins: {0.7,0.3}, {0.8,0.1}, {0.5,0.4}.',
    whyHard:
      'First-Fit Decreasing achieves ≤ 11/9·OPT + 6/9 bins. An asymptotic FPTAS exists. Strongly NP-complete (no pseudo-polynomial algorithm unless P=NP).',
    applications: ['Cloud resource allocation', 'Multi-processor scheduling', 'Stock cutting', 'Video streaming chunking'],
    reductionFrom: 'partition',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Bin packing problem', url: 'https://en.wikipedia.org/wiki/Bin_packing_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Next Fit: open a new bin when current bin can\'t fit item. 2-approximation.',
      'First Fit Decreasing (FFD): sort items descending, apply First Fit.',
      'Best Fit Decreasing: place item into bin with least remaining space.',
      'Integer linear programming for exact solution.',
    ],
  },
  {
    id: 'set-cover',
    name: 'Set Cover',
    shortName: 'Set Cover',
    category: 'Set & Covering',
    tags: ['optimization', 'covering', 'classic', 'approximable'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given universe U, collection of sets S = {S₁,…,Sₘ} ⊆ 2^U, and integer k, do k sets from S cover all of U?',
    informalDescription:
      'Set Cover asks for the fewest subsets that collectively contain every element. The greedy algorithm achieves a ln(n) approximation, which is optimal unless P = NP.',
    example:
      'U = {1,2,3,4,5}, sets: {1,2,3}, {2,4}, {3,4}, {4,5}. Two sets {1,2,3} and {4,5} cover U.',
    whyHard:
      'Inapproximable beyond (1−ε)·ln(n) under P ≠ NP. The greedy algorithm always picks the set covering the most uncovered elements.',
    applications: ['Sensor placement', 'Facility location', 'Test suite minimization', 'Species conservation planning'],
    reductionFrom: 'vertex-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Set cover problem', url: 'https://en.wikipedia.org/wiki/Set_cover_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Greedy: repeatedly pick the set covering the most uncovered elements. Achieves Hₙ ≈ ln(n) approximation.',
      'LP relaxation and randomised rounding.',
      'Dual fitting and primal-dual method.',
      'Parameterised algorithm: FPT in k (size of cover).',
    ],
  },
  {
    id: 'hitting-set',
    name: 'Hitting Set',
    shortName: 'Hitting Set',
    category: 'Set & Covering',
    tags: ['covering', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a collection of sets over universe U and integer k, is there a hitting set H ⊆ U of size ≤ k that intersects every set?',
    informalDescription:
      'Hitting Set is the dual of Set Cover. Every hitting set instance is a set cover instance on the transposed hypergraph.',
    example:
      'Sets: {a,b}, {b,c}, {a,c}. Hitting set: {b,c} hits all three sets.',
    whyHard:
      'Dual to Set Cover — same hardness and approximation bounds apply. Vertex Cover is the special case where all sets have size 2.',
    applications: ['Fault identification in systems', 'Database constraint checking', 'Biological pathway analysis'],
    reductionFrom: 'set-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Hitting set', url: 'https://en.wikipedia.org/wiki/Hitting_set', type: 'wiki' },
    ],
    algorithmSteps: [
      'Reduce to Set Cover on transposed hypergraph.',
      'Greedy: pick element appearing most often across uncovered sets.',
      'LP relaxation + rounding.',
      'FPT algorithm in parameter k.',
    ],
  },
  {
    id: 'dominating-set',
    name: 'Dominating Set',
    shortName: 'Dominating Set',
    category: 'Graph Theory',
    tags: ['graph', 'covering', 'decision'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given graph G = (V,E) and integer k, does G have a dominating set of size ≤ k (a set D such that every vertex not in D is adjacent to some vertex in D)?',
    informalDescription:
      'A dominating set "controls" the graph: every vertex is either in the set or adjacent to one. Related to facility location and network design.',
    example:
      'In a path 1–2–3–4–5, {2,4} is a dominating set of size 2.',
    whyHard:
      'Generalises vertex cover. Even on planar graphs it is NP-complete. Admits a greedy ln(Δ)+1 approximation (Δ = max degree).',
    applications: ['Wireless sensor network coverage', 'Social network influence maximisation', 'Road network service placement'],
    reductionFrom: 'set-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Dominating set', url: 'https://en.wikipedia.org/wiki/Dominating_set', type: 'wiki' },
    ],
    algorithmSteps: [
      'Greedy: pick vertex dominating most undominated neighbors.',
      'Reduction from Set Cover with unit set size.',
      'FPT algorithm in parameter k.',
      'For trees: polynomial-time DP.',
    ],
  },
  {
    id: 'feedback-vertex',
    name: 'Feedback Vertex Set',
    shortName: 'FVS',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given graph G = (V,E) and integer k, is there a set F ⊆ V of size ≤ k whose removal makes G acyclic (a forest)?',
    informalDescription:
      'FVS asks for the smallest set of vertices to remove to break all cycles. Equivalently, the remaining graph is a forest. Admits an O(2^k · k!) FPT algorithm.',
    example:
      'In a cycle C₄ (1–2–3–4–1), removing any single vertex makes it a path.',
    whyHard:
      'Capturing all cycles requires reasoning about the entire graph structure. Admits a 2-approximation and is FPT.',
    applications: ['Deadlock prevention in operating systems', 'VLSI layout', 'Bayesian network learning'],
    reductionFrom: 'vertex-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Feedback vertex set', url: 'https://en.wikipedia.org/wiki/Feedback_vertex_set', type: 'wiki' },
    ],
    algorithmSteps: [
      '2-approximation: repeatedly pick a vertex in a cycle, remove it.',
      'FPT by iterative compression.',
      'Randomized algorithm: random walk on cycles.',
      'ILP formulation with cycle constraints.',
    ],
  },
  {
    id: 'steiner-tree',
    name: 'Steiner Tree in Graphs',
    shortName: 'Steiner Tree',
    category: 'Network Flow',
    tags: ['graph', 'optimization', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given graph G = (V,E,w) with edge weights and a set of terminals T ⊆ V, find a minimum-weight tree spanning all terminals (using Steiner points from V \\ T).',
    informalDescription:
      'Steiner Tree generalizes minimum spanning tree: given a subset of "required" vertices, find the shortest sub-network connecting them (possibly routing through extra vertices).',
    example:
      'Connect cities A, B, C with highways, possibly routing through junction D if it reduces total length.',
    whyHard:
      'MST is poly-time when all vertices are required. Allowing optional Steiner points makes the problem NP-complete. Admits a 1.39-approximation (Zelikovsky, 1993).',
    applications: ['Circuit design (VLSI)', 'Network topology design', 'Phylogenetic tree reconstruction'],
    reductionFrom: 'vertex-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Steiner tree problem', url: 'https://en.wikipedia.org/wiki/Steiner_tree_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'MST heuristic: compute MST on terminal vertices using shortest paths. 2-approximation.',
      'Dreyfus–Wagner DP: exact algorithm O(3^|T| · n + 2^|T| · n²).',
      'Zelikovsky 11/6-approximation using extra Steiner points.',
      'LP relaxation and iterated rounding.',
    ],
  },
  {
    id: 'max-cut',
    name: 'Maximum Cut',
    shortName: 'MAX-CUT',
    category: 'Graph Theory',
    tags: ['graph', 'optimization', 'inapproximable'],
    complexity: 'NP-complete (optimisation is NP-hard)',
    formalDefinition:
      'Given undirected graph G = (V,E) and integer k, is there a partition of V into sets S and V\\S such that at least k edges have one endpoint in each part?',
    informalDescription:
      'MAX-CUT seeks to partition the vertex set to maximise the number of "crossing" edges. The Goemans–Williamson SDP-based algorithm achieves a 0.878-approximation.',
    example:
      'In K₄, the best cut puts 2 vertices on each side, cutting all 4 edges between sides.',
    whyHard:
      'APX-hard — inapproximable beyond 0.941 under the Unique Games Conjecture. The SDP bound is likely tight.',
    applications: ['Image segmentation', 'Circuit partitioning', 'Statistical physics (Ising model ground state)'],
    reductionFrom: '3sat',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Maximum cut', url: 'https://en.wikipedia.org/wiki/Maximum_cut', type: 'wiki' },
      { title: 'Goemans–Williamson (1995)', url: 'https://dl.acm.org/doi/10.1145/227683.227684', type: 'paper' },
    ],
    algorithmSteps: [
      'Random partition: achieves ½-approximation in expectation.',
      'Greedy: assign each vertex to the side maximising new cut edges.',
      'Goemans–Williamson SDP: solve SDP relaxation, round by random hyperplane. Achieves 0.878·OPT.',
      'Local search: move vertices to improve cut value until no improvement.',
    ],
  },
  {
    id: 'graph-isomorphism',
    name: 'Subgraph Isomorphism',
    shortName: 'Subgraph Iso.',
    category: 'Graph Theory',
    tags: ['graph', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given graphs G and H, does H contain a subgraph isomorphic to G (a subset of vertices and edges of H that is isomorphic to G)?',
    informalDescription:
      'Subgraph isomorphism asks whether a "pattern graph" appears as a part of a larger "target graph". It is the decision version of graph pattern matching.',
    example:
      'Does this social network contain a triangle (3-cycle)? Equivalent to 3-clique detection.',
    whyHard:
      'Contains clique detection as a special case. Graph Isomorphism itself (are two graphs identical up to relabelling?) is in NP but not known to be NP-complete — it is in quasi-polynomial time (Babai, 2015).',
    applications: ['Chemical structure matching', 'Network motif detection', 'Code plagiarism detection'],
    reductionFrom: 'clique',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Subgraph isomorphism', url: 'https://en.wikipedia.org/wiki/Subgraph_isomorphism_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Ullmann\'s backtracking algorithm with constraint propagation.',
      'VF2 algorithm: incremental isomorphism via state-space search.',
      'For trees: polynomial algorithms via tree DP.',
      'Parameterised by treewidth.',
    ],
  },
  {
    id: 'job-scheduling',
    name: 'Job Shop Scheduling',
    shortName: 'Job Scheduling',
    category: 'Scheduling & Packing',
    tags: ['scheduling', 'optimization', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given n jobs, m machines, processing times pᵢⱼ, and a makespan bound C, can all jobs be scheduled on machines respecting constraints with completion time ≤ C?',
    informalDescription:
      'Job Shop Scheduling assigns operations of jobs to machines in a given order, minimising the time to complete all jobs (makespan). Even 2-machine 3-job instances are NP-complete in the open-shop variant.',
    example:
      '3 jobs × 3 machines: each job visits machines in a different order. Find the schedule minimising completion time.',
    whyHard:
      'The number of feasible schedules grows super-exponentially. Even computing a 3/2−ε approximation is APX-hard.',
    applications: ['Manufacturing planning', 'CPU task scheduling', 'Hospital operating room scheduling', 'Parallel computing'],
    reductionFrom: 'partition',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Job-shop scheduling', url: 'https://en.wikipedia.org/wiki/Job-shop_scheduling', type: 'wiki' },
    ],
    algorithmSteps: [
      'Disjunctive graph model: precedence arcs and machine conflict arcs.',
      'Shifting Bottleneck heuristic.',
      'Tabu search and genetic algorithms.',
      'Branch and bound with LP relaxation bounds.',
    ],
  },
  {
    id: 'exact-cover',
    name: 'Exact Cover',
    shortName: 'Exact Cover',
    category: 'Set & Covering',
    tags: ['covering', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given universe U and collection S of subsets of U, is there a sub-collection S* ⊆ S where each element of U occurs in exactly one set in S*?',
    informalDescription:
      'Exact Cover is a clean combinatorial problem: partition U precisely using disjoint sets from the collection. Sudoku and polyomino tiling reduce to Exact Cover.',
    example:
      'U = {1,2,3,4}, S = {{1,2},{3,4},{2,3},{1,4}}. S* = {{1,2},{3,4}} is an exact cover.',
    whyHard:
      'Knuth\'s Algorithm X (implemented as Dancing Links, DLX) solves it efficiently in practice. Generalises 3-dimensional matching.',
    applications: ['Sudoku solving', 'Polyomino tiling', 'N-queens', 'Pentomino puzzles'],
    reductionFrom: '3sat',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Exact cover', url: 'https://en.wikipedia.org/wiki/Exact_cover', type: 'wiki' },
      { title: 'Knuth — Dancing Links (2000)', url: 'https://arxiv.org/abs/cs/0011047', type: 'paper' },
    ],
    algorithmSteps: [
      'Represent as 0/1 matrix: rows = sets, columns = elements.',
      'Algorithm X: choose column, select row covering it, recurse on reduced matrix, backtrack.',
      'Dancing Links (DLX): Algorithm X with efficient linked-list representation for fast backtracking.',
      'Cover one column at a time, recurse, uncover on backtrack.',
    ],
  },
  {
    id: '3d-matching',
    name: '3-Dimensional Matching',
    shortName: '3DM',
    category: 'Set & Covering',
    tags: ['combinatorial', 'decision', 'covering'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given disjoint sets X, Y, Z (each of size n) and triples T ⊆ X×Y×Z, is there a subset M ⊆ T of n triples such that each element of X∪Y∪Z appears in exactly one triple?',
    informalDescription:
      '3DM generalizes bipartite matching to three sets. 2D bipartite matching is polynomial (max-flow), but 3D is NP-complete. It models assignment of resources from three independent groups.',
    example:
      'X = {courses}, Y = {time slots}, Z = {rooms}. Find conflict-free schedule assigning each course a unique slot and room.',
    whyHard:
      'The third dimension breaks the bipartite structure, eliminating polynomial matching algorithms.',
    applications: ['Tripartite resource scheduling', 'Organ transplant matching (multi-party)', 'Multi-commodity assignment'],
    reductionFrom: 'exact-cover',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — 3-dimensional matching', url: 'https://en.wikipedia.org/wiki/3-dimensional_matching', type: 'wiki' },
    ],
    algorithmSteps: [
      'Reduction from 3-SAT via clause-variable gadgets.',
      'Backtracking search with constraint propagation.',
      'ILP formulation: binary variables for each triple.',
      'FPT algorithms parameterised by solution size.',
    ],
  },
  {
    id: 'longest-path',
    name: 'Longest Path in a Graph',
    shortName: 'Longest Path',
    category: 'Graph Theory',
    tags: ['graph', 'optimization', 'decision'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a weighted graph G = (V,E,w) and integer k, is there a simple path of total weight ≥ k?',
    informalDescription:
      'Unlike shortest path (Dijkstra, poly-time), longest path is NP-complete because it generalizes the Hamiltonian path problem. The constraint that the path be simple is what makes it hard.',
    example:
      'In a grid graph, find the longest path that does not revisit any cell — equivalent to the snake-in-a-box problem.',
    whyHard:
      'Hamiltonian path is a special case (k = n−1 edges, unweighted). The polynomial tractability of shortest path relies on optimal substructure, which simple-path constraints destroy.',
    applications: ['Critical path in project management', 'Game solving (e.g., Snake)', 'Sequence alignment (when gap penalties are involved)'],
    reductionFrom: 'hamiltonian-cycle',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Longest path problem', url: 'https://en.wikipedia.org/wiki/Longest_path_problem', type: 'wiki' },
    ],
    algorithmSteps: [
      'Reduce from Hamiltonian Path: ask if longest path has n−1 edges.',
      'DP on DAGs: O(V+E) — poly-time on directed acyclic graphs.',
      'Color-coding technique (Alon et al.): randomised FPT.',
      'Approximation: greedy DFS, depth-first exploration.',
    ],
  },
  {
    id: 'bandwidth',
    name: 'Graph Bandwidth',
    shortName: 'Bandwidth',
    category: 'Graph Theory',
    tags: ['graph', 'optimization', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given graph G = (V,E) and integer k, is there a bijection f: V → {1,…,|V|} such that for all edges (u,v) ∈ E, |f(u)−f(v)| ≤ k?',
    informalDescription:
      'Bandwidth assigns numbers to vertices minimising the maximum "stretch" across edges. Useful for sparse matrix bandwidth reduction (Cuthill–McKee).',
    example:
      'A path graph on n vertices has bandwidth 1 with the natural ordering 1,2,…,n.',
    whyHard:
      'NP-complete even for caterpillar trees. The Cuthill–McKee heuristic gives good practical results.',
    applications: ['Sparse matrix storage optimisation', 'Finite element analysis', 'Parallel algorithm efficiency'],
    reductionFrom: 'hamiltonian-cycle',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Graph bandwidth', url: 'https://en.wikipedia.org/wiki/Graph_bandwidth', type: 'wiki' },
    ],
    algorithmSteps: [
      'Cuthill–McKee: BFS-based heuristic starting from a peripheral vertex.',
      'Simulated annealing for vertex ordering.',
      'Spectral ordering: use Fiedler eigenvector of Laplacian.',
      'Branch-and-bound exact search.',
    ],
  },
  {
    id: 'quadratic-programming',
    name: 'Integer Quadratic Programming',
    shortName: 'IQP',
    category: 'Number Theory',
    tags: ['optimization', 'number', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a quadratic objective function f(x) = xᵀQx + cᵀx with integer variables x ∈ Zⁿ and linear constraints, does a feasible integer solution achieve objective value ≤ k?',
    informalDescription:
      'IQP unifies many NP-complete problems: MAX-CUT, max independent set, and others encode naturally as quadratic integer programs. The continuous relaxation is solvable in poly-time (SDP).',
    example:
      'Maximise xᵀQx over x ∈ {0,1}ⁿ: equivalent to MAX-CUT with appropriate Q.',
    whyHard:
      'Integer constraints make even quadratic minimisation NP-hard. The SDP relaxation gives the Goemans–Williamson bound for MAX-CUT.',
    applications: ['Portfolio optimisation under risk', 'MAX-CUT formulation', 'Binary quadratic assignment', 'D-Wave quantum annealing target problems'],
    reductionFrom: 'max-cut',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Quadratic programming', url: 'https://en.wikipedia.org/wiki/Quadratic_programming', type: 'wiki' },
    ],
    algorithmSteps: [
      'SDP relaxation: relax binary variables to unit vectors, solve with interior-point methods.',
      'Randomised rounding of SDP solution.',
      'Simulated annealing or quantum annealing heuristics.',
      'Branch and bound with SDP bounds.',
    ],
  },
  {
    id: 'number-partition',
    name: 'Number Partitioning',
    shortName: 'Num. Partition',
    category: 'Number Theory',
    tags: ['number', 'decision', 'combinatorial'],
    complexity: 'NP-complete',
    formalDefinition:
      'Given a multiset A of positive integers, partition A into two subsets A₁ and A₂ minimising |sum(A₁) − sum(A₂)|.',
    informalDescription:
      'Number Partitioning is the optimisation version of Partition. It is called the "easiest hard problem" because random instances are easy (concentrated distribution of sums).',
    example:
      'A = {1, 5, 11, 5, 6, 4}. Optimal split: {11,4} and {1,5,5,6} — both sum to 15.',
    whyHard:
      'The decision version (exact equal partition) is NP-complete. The optimisation version has polynomial average-case behaviour but NP-hard worst case.',
    applications: ['Fair division', 'Multiprocessor load balancing', 'Cryptography (subset sum-based)'],
    reductionFrom: 'partition',
    reducesTo: [],
    references: [
      { title: 'Wikipedia — Partition problem', url: 'https://en.wikipedia.org/wiki/Partition_problem', type: 'wiki' },
      { title: 'Mertens (2006) — The Easiest Hard Problem', url: 'https://arxiv.org/abs/cond-mat/0310317', type: 'paper' },
    ],
    algorithmSteps: [
      'Greedy (LPT): assign each number to lighter partition.',
      'Dynamic programming: pseudo-polynomial O(n·sum).',
      'Karmarkar–Karp differencing: O(n log n), very effective in practice.',
      'Complete Karmarkar–Karp (CKK): exact exponential with early termination.',
    ],
  },
];

// Build reduction map for graph
export const reductions: Reduction[] = problems.flatMap(p =>
  (p.reducesTo ?? []).map(to => ({
    from: p.id,
    to,
    description: `${p.name} reduces to ${problems.find(q => q.id === to)?.name ?? to}`,
  }))
);

export const categories: Category[] = Array.from(
  new Set(problems.map(p => p.category))
) as Category[];

export const allTags: Tag[] = Array.from(
  new Set(problems.flatMap(p => p.tags))
) as Tag[];

export function getProblemById(id: string): Problem | undefined {
  return problems.find(p => p.id === id);
}

export function getProblemsByCategory(category: Category): Problem[] {
  return problems.filter(p => p.category === category);
}

export function getProblemsByTag(tag: Tag): Problem[] {
  return problems.filter(p => p.tags.includes(tag));
}

export function searchProblems(query: string): Problem[] {
  const q = query.toLowerCase();
  return problems.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.informalDescription.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
  );
}
