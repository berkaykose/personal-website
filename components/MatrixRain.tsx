'use client'
import { useEffect, useRef } from 'react'

const PHRASES = [
  'You know how to reach me',
  'Welcome to my website',
  'I love Dota and Counter Strike',
  'Big matrix fan, as you can see',
  'I love LOTR too',
  'Do you need help?',
  'What can I help you with?'
]

const ACCENT = '107, 117, 51' // #6b7533

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // next/font, --font-mono'yu üretilmiş (hash'lenmiş) bir font-family adına
    // bağlar; canvas'ta doğrudan "JetBrains Mono" yazmak eşleşmez ve tarayıcı
    // sessizce genel monospace'e düşer. Gizli bir eleman üzerinden gerçek,
    // çözümlenmiş font-family string'ini okuyoruz.
    const probe = document.createElement('span')
    probe.style.fontFamily = 'var(--font-mono)'
    probe.style.position = 'absolute'
    probe.style.visibility = 'hidden'
    document.body.appendChild(probe)
    const monoFontFamily = getComputedStyle(probe).fontFamily
    document.body.removeChild(probe)

    const FONT = 14
    const MAX_STREAMS = 2
    const SPAWN_MIN = 4000
    const SPAWN_MAX = 8000

    type Stream = {
      x: number       // piksel bazlı x
      y: number       // piksel bazlı y (phrasing'in en üstü)
      chars: string[]
      alpha: number
      speed: number
    }

    let streams: Stream[] = []
    let rafId: number
    let cancelled = false
    let lastTime = 0
    let nextSpawnAt = 0
    let lastPhraseIdx = -1

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawnStream = (now: number) => {
      let idx
      do { idx = Math.floor(Math.random() * PHRASES.length) } while (idx === lastPhraseIdx)
      lastPhraseIdx = idx

      const chars = PHRASES[idx].split('')
      const phraseWidth = chars.length * FONT
      const maxX = Math.max(FONT * 2, canvas.width - phraseWidth - FONT * 2)

      streams.push({
        x: rand(FONT * 2, maxX),
        y: -chars.length * FONT,
        chars,
        alpha: rand(0.55, 0.75),
        speed: rand(90, 160),
      })
      nextSpawnAt = now + rand(SPAWN_MIN, SPAWN_MAX)
    }

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)

      const dt = lastTime === 0 ? 0 : Math.min(now - lastTime, 50) // ms, max 50 clamp
      lastTime = now

      if (streams.length < MAX_STREAMS && now >= nextSpawnAt) spawnStream(now)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT}px ${monoFontFamily}`

      streams = streams.filter((s) => {
        s.y += s.speed * (dt / 1000)

        const len = s.chars.length
        const phraseH = len * FONT
        const headY = s.y + phraseH  // phrasing'in altı

        const entryFade = Math.min(1, headY / (canvas.height * 0.18))
        const exitFade = Math.min(1, (canvas.height - headY) / (canvas.height * 0.22))
        const screenFade = Math.min(entryFade, Math.max(0, exitFade))

        for (let i = 0; i < len; i++) {
          const charY = s.y + i * FONT
          if (charY < -FONT || charY > canvas.height + FONT) continue

          const isHead = i === len - 1
          const trailFade = isHead ? 1 : 0.3 + (i / len) * 0.6
          const alpha = Math.min(s.alpha * trailFade * screenFade, 0.9)

          ctx.fillStyle = `rgba(${ACCENT}, ${alpha})`
          ctx.fillText(s.chars[i], s.x, charY)
        }

        return headY < canvas.height + phraseH + FONT
      })
    }

    // Canvas, DOM'un aksine bir @font-face'i "kullanılınca" otomatik yüklemez:
    // ctx.font doğru family string'ini gösterse bile, gerçek font dosyası
    // Font Loading API üzerinden yüklenmeden fillText sessizce fallback'e
    // düşer. Çizime başlamadan önce ilgili font yüzlerini elle yüklüyoruz.
    const primaryFamily = monoFontFamily.split(',')[0].replace(/["']/g, '').trim()
    const facesToLoad = Array.from(document.fonts).filter((f) => f.family === primaryFamily)
    Promise.all(facesToLoad.map((f) => f.load().catch(() => {}))).then(() => {
      if (cancelled) return
      spawnStream(0)
      nextSpawnAt = rand(SPAWN_MIN / 2, SPAWN_MAX / 2)
      rafId = requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
