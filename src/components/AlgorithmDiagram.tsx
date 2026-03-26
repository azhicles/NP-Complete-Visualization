import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface Props {
  steps: string[]
}

/**
 * Renders a horizontal algorithm step diagram – each step is a box,
 * connected by arrows, as an SVG drawn with D3.
 */
export default function AlgorithmDiagram({ steps }: Props) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current || steps.length === 0) return

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const BOX_W = 180
    const BOX_H = 70
    const GAP = 40
    const PAD = 16
    const totalW = steps.length * (BOX_W + GAP) - GAP + 2 * PAD
    const totalH = BOX_H + 2 * PAD

    svg
      .attr('viewBox', `0 0 ${totalW} ${totalH}`)
      .attr('width', '100%')
      .attr('height', Math.min(totalH, 120))
      .attr('preserveAspectRatio', 'xMidYMid meet')

    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'step-arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#C4A06A')

    const g = svg.append('g').attr('transform', `translate(${PAD},${PAD})`)

    steps.forEach((step, i) => {
      const x = i * (BOX_W + GAP)

      // Arrow between boxes
      if (i > 0) {
        g.append('line')
          .attr('x1', x - GAP)
          .attr('y1', BOX_H / 2)
          .attr('x2', x)
          .attr('y2', BOX_H / 2)
          .attr('stroke', '#C4A06A')
          .attr('stroke-width', 1.5)
          .attr('marker-end', 'url(#step-arrow)')
      }

      // Box
      g.append('rect')
        .attr('x', x)
        .attr('y', 0)
        .attr('width', BOX_W)
        .attr('height', BOX_H)
        .attr('rx', 6)
        .attr('fill', '#FDFAF4')
        .attr('stroke', '#DDD3C0')
        .attr('stroke-width', 1)

      // Step number
      g.append('text')
        .attr('x', x + 10)
        .attr('y', 18)
        .attr('fill', '#7A5C2E')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('font-family', 'serif')
        .text(`${i + 1}`)

      // Wrap text
      const words = step.split(' ')
      let line = ''
      let lineNum = 0
      const lineHeight = 13
      const startY = 30

      words.forEach((word, wi) => {
        const testLine = line + word + ' '
        if (testLine.length > 22 && wi > 0) {
          g.append('text')
            .attr('x', x + 8)
            .attr('y', startY + lineNum * lineHeight)
            .attr('fill', '#2C2416')
            .style('font-size', '9.5px')
            .style('font-family', 'serif')
            .text(line.trim())
          line = word + ' '
          lineNum++
        } else {
          line = testLine
        }
      })
      if (line.trim()) {
        g.append('text')
          .attr('x', x + 8)
          .attr('y', startY + lineNum * lineHeight)
          .attr('fill', '#2C2416')
          .style('font-size', '9.5px')
          .style('font-family', 'serif')
          .text(line.trim())
      }
    })
  }, [steps])

  return (
    <div className="vis-canvas" style={{ padding: '0.75rem', overflowX: 'auto' }}>
      <svg ref={ref} aria-label="Algorithm step diagram" />
    </div>
  )
}
