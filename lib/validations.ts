import { z } from "zod"

// Link validation schema
export const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  url: z.string().url("Must be a valid URL"),
  description: z.string().max(200, "Description too long").optional(),
  icon: z.string().optional(),
  category: z.enum(["hotel", "activities", "contact"]),
  isActive: z.boolean().default(true),
})

export type LinkFormData = z.infer<typeof linkSchema>

// Activity validation schema
export const activitySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  imageUrl: z.string().url("Must be a valid image URL"),
  weatherCondition: z.enum(["sunny", "cloudy", "rainy", "snowy"]),
  priority: z.number().min(1).max(10).default(5),
  isActive: z.boolean().default(true),
})

export type ActivityFormData = z.infer<typeof activitySchema>

// Branding validation schema
export const brandingSchema = z.object({
  name: z.string().min(1, "Hotel name is required").max(100),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Must be a valid email"),
  description: z.string().max(500, "Description too long").optional(),
  welcomeMessage: z.string().max(200, "Welcome message too long").optional(),
})

export type BrandingFormData = z.infer<typeof brandingSchema>

// Settings validation schema
export const settingsSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Must be a valid email"),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
    confirmPassword: z.string().min(8).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  )

export type SettingsFormData = z.infer<typeof settingsSchema>
