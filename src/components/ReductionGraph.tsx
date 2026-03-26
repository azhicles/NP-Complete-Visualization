import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'
import { problems, reductions } from '../data/problems'

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string
  name: string
  shortName: string
  category: string
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum
  target: string | NodeDatum
  description: string
}

const CATEGORY_COLORS: Record<string, string> = {
  'Graph Theory':         '#7A5C2E',
  'Satisfiability':       '#5C2E7A',
  'Scheduling & Packing': '#2E5C7A',
  'Number Theory':        '#2E7A5C',
  'Set & Covering':       '#7A2E5C',
  'Network Flow':         '#5C7A2E',
  'Sequencing':           '#7A3E2E',
  'Geometry':             '#3E7A2E',
}

interface Props {
  height?: number
  highlightId?: string
}

export default function ReductionGraph({ height = 520, highlightId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; category: string } | null>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const h = height

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${h}`)

    // Arrow marker
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#C8B99A')

    defs.append('marker')
      .attr('id', 'arrowhead-highlight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#7A5C2E')

    const nodes: NodeDatum[] = problems.map(p => ({
      id: p.id,
      name: p.name,
      shortName: p.shortName,
      category: p.category,
    }))

    const links: LinkDatum[] = reductions.map(r => ({
      source: r.from,
      target: r.to,
      description: r.description,
    }))

    const simulation = d3.forceSimulation<NodeDatum>(nodes)
      .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
        .id(d => d.id)
        .distance(110)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, h / 2))
      .force('collision', d3.forceCollide(40))

    // Zoom
    const g = svg.append('g')
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    // Links
    const link = g.append('g')
      .selectAll<SVGLineElement, LinkDatum>('line')
      .data(links)
      .join('line')
      .attr('class', d => {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as NodeDatum).id
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as NodeDatum).id
        const isHighlighted = highlightId && (srcId === highlightId || tgtId === highlightId)
        return `graph-link${isHighlighted ? ' highlighted' : ''}`
      })
      .attr('marker-end', d => {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as NodeDatum).id
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as NodeDatum).id
        const isHighlighted = highlightId && (srcId === highlightId || tgtId === highlightId)
        return isHighlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'
      })

    // Nodes
    const node = g.append('g')
      .selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'graph-node')
      .attr('role', 'button')
      .attr('aria-label', d => d.name)
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, NodeDatum>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x; d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })
      )

    node.on('mouseenter', (event: MouseEvent, d: NodeDatum) => {
      setTooltip({ x: event.clientX + 12, y: event.clientY - 10, name: d.name, category: d.category })
    })
    node.on('mousemove', (event: MouseEvent) => {
      setTooltip(prev => prev ? { ...prev, x: event.clientX + 12, y: event.clientY - 10 } : null)
    })
    node.on('mouseleave', () => setTooltip(null))
    node.on('click', (_event: MouseEvent, d: NodeDatum) => navigate(`/problem/${d.id}`))

    node.append('circle')
      .attr('r', d => d.id === highlightId ? 22 : 16)
      .attr('fill', d => CATEGORY_COLORS[d.category] ?? '#7A5C2E')
      .attr('fill-opacity', d => d.id === highlightId ? 1 : 0.75)
      .attr('stroke', d => d.id === highlightId ? '#2C2416' : '#F7F2E8')
      .attr('stroke-width', d => d.id === highlightId ? 2.5 : 1.5)

    node.append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text(d => d.shortName)
      .style('font-size', '10px')
      .style('fill', '#2C2416')

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NodeDatum).x ?? 0)
        .attr('y1', d => (d.source as NodeDatum).y ?? 0)
        .attr('x2', d => (d.target as NodeDatum).x ?? 0)
        .attr('y2', d => (d.target as NodeDatum).y ?? 0)

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Legend
    const legendData = Object.entries(CATEGORY_COLORS)
    const legend = svg.append('g')
      .attr('transform', `translate(12, 12)`)

    legendData.forEach(([cat, color], i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 18})`)
      row.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 5).attr('fill', color).attr('fill-opacity', 0.8)
      row.append('text').attr('x', 14).attr('y', 9).style('font-size', '9px').style('fill', '#6B5C3E').text(cat)
    })

    return () => { simulation.stop() }
  }, [height, highlightId, navigate])

  return (
    <div ref={containerRef} className="graph-container" style={{ height }}>
      <svg ref={svgRef} width="100%" height={height} aria-label="NP-complete reduction graph" />
      {tooltip && (
        <div
          className="graph-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <strong>{tooltip.name}</strong>
          <span style={{ color: '#6B5C3E', fontSize: '0.8em' }}>{tooltip.category}</span>
        </div>
      )}
    </div>
  )
}
