import { z } from 'zod'

export const checklistFormSchema = z.object({
  title: z.string().min(1, 'Checklist title is required'),
  items: z
    .array(z.object({ value: z.string().min(1, 'Checklist item is required') }))
    .min(1, 'At least one item is required'),
})

export type ChecklistFormValues = z.infer<typeof checklistFormSchema>
