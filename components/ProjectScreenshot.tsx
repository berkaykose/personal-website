'use client'
import { useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  objectPosition?: 'top' | 'center'
  zoom?: number
}

export default function ProjectScreenshot({ src, alt, objectPosition = 'top', zoom = 1.2 }: Props) {
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const close = () => {
    setVisible(false)
    window.setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => {
    if (!open) return

    const raf = requestAnimationFrame(() => setVisible(true))
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt}
        className="group relative block w-full h-full overflow-hidden"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          style={{ '--zoom': zoom, '--zoom-hover': zoom + 0.04 } as CSSProperties}
          className={`object-cover ${objectPosition === 'top' ? 'object-top' : 'object-center'} pointer-events-none grayscale scale-[var(--zoom)] transition-all duration-200 group-hover:scale-[var(--zoom-hover)] group-hover:grayscale-0`}
        />
      </button>

      {open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 transition-opacity duration-200 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t('close')}
            className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
          <div
            className={`relative w-full h-full max-w-[85vw] max-h-[85vh] aspect-video transition-all duration-200 ${
              visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="85vw"
              className="object-contain"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
