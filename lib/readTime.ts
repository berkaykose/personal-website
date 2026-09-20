import type { RenderableBlock } from '@/components/ContentBlockRenderer'

const WORDS_PER_MINUTE = 200

export function estimateReadTime(blocks: RenderableBlock[]): number {
  const words = blocks.reduce((sum, block) => {
    const text = block.type === 'code' ? block.code : block.text
    return sum + text.trim().split(/\s+/).filter(Boolean).length
  }, 0)
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
