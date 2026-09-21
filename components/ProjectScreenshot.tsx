'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  width?: number | null
  height?: number | null
}

export default function ProjectScreenshot({ src, alt, width, height }: Props) {
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
        className="group relative flex items-center justify-center w-full h-full p-6"
      >
        {width && height ? (
          // Gerçek en/boy oranıyla, boyutlandırılmış (fill değil) bir <img> —
          // border/shadow bu sayede kutuya değil, görselin gerçek kenarlarına sarıyor.
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 768px) 33vw, 100vw"
            className="max-w-full max-h-full w-auto h-auto border border-black/[0.08] shadow-[0_14px_35px_rgba(0,0,0,0.06)] pointer-events-none grayscale transition-all duration-200 group-hover:grayscale-0"
          />
        ) : (
          // Eski (boyutsuz) ekran görüntüleri için geriye dönük uyumluluk.
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain pointer-events-none grayscale transition-all duration-200 group-hover:grayscale-0"
          />
        )}
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
