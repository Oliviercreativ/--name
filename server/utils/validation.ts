import { z } from 'zod'

// Schéma de validation pour créer une réservation
export const createReservationSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  customerEmail: z.string().email('Email invalide'),
  customerPhone: z.string().min(10, 'Numéro de téléphone invalide'),
  reservationDate: z.string().datetime('Date invalide'),
  numberOfGuests: z.number().int().min(1, 'Au moins 1 personne').max(20, 'Maximum 20 personnes'),
  specialRequests: z.string().optional()
})

// Schéma de validation pour mettre à jour une réservation
export const updateReservationSchema = z.object({
  customerName: z.string().min(2).max(100).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(10).optional(),
  reservationDate: z.string().datetime().optional(),
  numberOfGuests: z.number().int().min(1).max(20).optional(),
  specialRequests: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional()
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>
