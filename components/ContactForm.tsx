'use client'
import { useActionState, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sendMessage, type ContactState } from '@/app/[locale]/contact/actions'

export default function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const [state, action, isPending] = useActionState<ContactState, FormData>(sendMessage, null)
  const [dismissed, setDismissed] = useState(false)

  const sentAt = state?.sentAt
    ? new Date(state.sentAt).toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  if (state?.success && !dismissed) {
    return (
      <div className="min-h-[350px]">
        <p className="flex items-center gap-2 font-mono text-base font-semibold tracking-[0.14em] uppercase text-foreground mb-4">
          <span aria-hidden="true" className="text-accent">✓</span>
          {t('success_title')}
        </p>
        <p className="text-sm text-muted mb-8">
          {t('success_desc_1')}
          <br />
          {t('success_desc')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border pt-6 mb-8">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">
              {t('success_response_time_label')}
            </p>
            <p className="text-sm text-foreground">{t('success_response_time')}</p>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">
              {t('success_your_message_label')}
            </p>
            <p className="text-sm text-foreground">
              {sentAt ? t('success_sent_at', { time: sentAt }) : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            {t('success_back_home')} →
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            {t('success_reset')} →
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={action} onSubmit={() => setDismissed(false)} className="min-h-[420px] space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block font-mono text-xs tracking-widest uppercase text-muted mb-3">
            01 / {t('name_label')}
          </label>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            className="w-full px-4 py-3.5 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder={t('name_placeholder')}
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-mono text-xs tracking-widest uppercase text-muted mb-3">
            02 / {t('email_label')}
          </label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="w-full px-4 py-3.5 text-sm border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            placeholder={t('email_placeholder')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-xs tracking-widest uppercase text-muted mb-3">
          03 / {t('message_label')}
        </label>
        <textarea
          id="message" name="message" rows={7} required
          className="w-full px-4 py-3.5 text-sm leading-relaxed border border-border rounded-md bg-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
          placeholder={t('message_placeholder')}
        />
      </div>

      {state?.errorKey && (
        <p className="text-sm text-red-600">{t(state.errorKey as 'error_required' | 'error_email')}</p>
      )}

      <button
        type="submit" disabled={isPending}
        className="inline-flex items-center gap-1 bg-accent text-white text-sm font-medium px-6 py-2.5 rounded-md hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? t('submitting') : `${t('submit')} →`}
      </button>
    </form>
  )
}
