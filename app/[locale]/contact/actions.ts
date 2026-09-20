'use server'

// Hata mesajı yerine hata ANAHTARI döndürüyoruz.
// Çeviri client tarafında (ContactForm) yapılıyor, böylece action locale-bağımsız kalıyor.
export type ContactState = { success: boolean; errorKey?: string; sentAt?: string } | null

export async function sendMessage(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const message = formData.get('message') as string

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { success: false, errorKey: 'error_required' }
  }

  if (!email.includes('@')) {
    return { success: false, errorKey: 'error_email' }
  }

  // Gerçek email için Resend entegre edilebilir:
  // import { Resend } from 'resend'
  // await new Resend(process.env.RESEND_API_KEY).emails.send(...)
  console.log('Contact form:', { name, email, message })

  return { success: true, sentAt: new Date().toISOString() }
}
