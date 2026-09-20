import { highlightCode } from '@/lib/highlightCode'

// Tek dilde, önceden çözümlenmiş bloklar — hem public /writing sayfası hem de
// admin editörünün canlı önizlemesi bunu kullanır, ikisi de birebir aynı görünür.
export type RenderableBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; marker: string }
  | { type: 'quote'; text: string }
  | { type: 'code'; label: string; code: string }

export default function ContentBlockRenderer({ blocks }: { blocks: RenderableBlock[] }) {
  const headingNumbers = blocks.reduce<number[]>((acc, block) => {
    const previous = acc.length > 0 ? acc[acc.length - 1] : 0
    acc.push(block.type === 'heading' ? previous + 1 : previous)
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const number = String(headingNumbers[index]).padStart(2, '0')

          return (
            <div key={index} className="pt-4">
              <div className="font-mono text-[11px] tracking-[0.1em] text-accent mb-3">
                {number} / {block.marker.toUpperCase()}
              </div>
              <h2 className="font-display font-bold leading-[1.2] text-[clamp(1.75rem,3.2vw,2.375rem)]">
                {block.text}
              </h2>
            </div>
          )
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-accent pl-5 text-lg text-foreground leading-[1.6]"
            >
              {block.text}
            </blockquote>
          )
        }

        if (block.type === 'code') {
          return (
            <div key={index}>
              <div className="font-mono text-[11px] font-semibold tracking-[0.1em] text-accent mb-2">
                {block.label}
              </div>
              <pre className="bg-zinc-900 text-zinc-100 text-sm leading-relaxed rounded-md px-5 py-4 overflow-x-auto">
                <code>
                  {highlightCode(block.code).map((node, i) =>
                    node.className ? (
                      <span key={i} className={node.className}>
                        {node.text}
                      </span>
                    ) : (
                      node.text
                    )
                  )}
                </code>
              </pre>
            </div>
          )
        }

        return (
          <p key={index} className="text-lg leading-[1.8] text-zinc-600">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}
