import { reservations } from '~/server/db/schema'
import { createReservationSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Valider les données d'entrée
    const validatedData = createReservationSchema.parse(body)

    const db = useDB()

    // Créer la réservation
    const [newReservation] = await db
      .insert(reservations)
      .values({
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        reservationDate: new Date(validatedData.reservationDate),
        numberOfGuests: validatedData.numberOfGuests,
        specialRequests: validatedData.specialRequests || null,
        status: 'pending'
      })
      .returning()

    return {
      success: true,
      data: newReservation,
      message: 'Réservation créée avec succès'
    }
  } catch (error: any) {
    console.error('Erreur lors de la création de la réservation:', error)

    // Erreur de validation Zod
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création de la réservation'
    })
  }
})
