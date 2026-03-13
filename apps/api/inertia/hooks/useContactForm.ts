import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, submitContactForm, type ContactFormData } from '../lib/contact-form'

export function useContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      appVersion: '',
      privacyConsent: false,
      newsletter: false,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    setServerError(false)
    try {
      await submitContactForm(data)
      setSubmitted(true)
    } catch {
      setServerError(true)
    }
  })

  function resetForm() {
    form.reset()
    setSubmitted(false)
    setServerError(false)
  }

  return {
    form,
    onSubmit,
    resetForm,
    submitted,
    submitting: form.formState.isSubmitting,
    serverError,
    errors: form.formState.errors,
  }
}
