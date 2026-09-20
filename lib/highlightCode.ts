// Basit, siteye özel bir tokenizer — genel amaçlı bir syntax highlighter değil.
// Sadece 4 kategori tanır: comment (gri), at-rule/custom property (turuncu),
// hex renk/string (olive), geri kalan her şey düz metin (off-white).
const CODE_TOKEN_REGEX =
  /(\/\*[\s\S]*?\*\/)|(@[a-zA-Z-]+)|(--[a-zA-Z-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8})|('[^']*'|"[^"]*")/g

export interface HighlightedNode {
  text: string
  className?: string
}

export function highlightCode(code: string): HighlightedNode[] {
  const nodes: HighlightedNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = CODE_TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ text: code.slice(lastIndex, match.index) })
    }
    const [full, comment, atRule, customProp, hexColor, string] = match
    if (comment) nodes.push({ text: comment, className: 'text-zinc-500' })
    else if (atRule) nodes.push({ text: atRule, className: 'text-[var(--neon-orange)]' })
    else if (customProp) nodes.push({ text: customProp, className: 'text-[var(--neon-orange)]' })
    else if (hexColor) nodes.push({ text: hexColor, className: 'text-accent' })
    else if (string) nodes.push({ text: string, className: 'text-accent' })
    lastIndex = match.index + full.length
  }
  if (lastIndex < code.length) {
    nodes.push({ text: code.slice(lastIndex) })
  }
  return nodes
}
