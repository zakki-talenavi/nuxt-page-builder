/**
 * Form schema dari form builder.
 * Nanti form builder akan mendaftarkan form ke sini (setFormSchema).
 * Button modal tipe "form" hanya pakai formId dan baca schema dari sini.
 */

export type FormFieldSchema = {
  name: string
  type?: 'text' | 'email' | 'textarea' | 'number' | 'tel'
  label?: string
  placeholder?: string
  required?: boolean
}

export type FormSchema = {
  id: string
  name?: string
  fields: FormFieldSchema[]
  submitLabel?: string
}

const formSchemas = ref<Record<string, FormSchema>>({})

export function useFormSchema(formId: string | undefined) {
  const schema = computed<FormSchema | null>(() => {
    if (!formId) return null
    return formSchemas.value[formId] ?? null
  })

  const fields = computed(() => schema.value?.fields ?? [])
  const submitLabel = computed(() => schema.value?.submitLabel ?? 'Kirim')

  return { schema, fields, submitLabel }
}

/**
 * Untuk form builder: daftarkan / update form schema.
 * Nanti form builder memanggil ini setelah user menyimpan form.
 */
export function setFormSchema(formId: string, data: Omit<FormSchema, 'id'>) {
  formSchemas.value = {
    ...formSchemas.value,
    [formId]: { ...data, id: formId },
  }
}

/**
 * Hapus form schema (dari form builder).
 */
export function removeFormSchema(formId: string) {
  const next = { ...formSchemas.value }
  delete next[formId]
  formSchemas.value = next
}

/**
 * Daftar semua form (untuk dropdown di form builder / pemilihan form).
 */
export function useFormSchemasList() {
  return computed(() => Object.values(formSchemas.value))
}
