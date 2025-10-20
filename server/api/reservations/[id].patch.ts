import { eq } from 'drizzle-orm'
import { reservations } from '~/server/db/schema'
import { updateReservationSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')

    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID invalide'
      })
    }

    const body = await readBody(event)

    // Valider les données d'entrée
    const validatedData = updateReservationSchema.parse(body)

    const db = useDB()

    // Préparer les données à mettre à jour
    const updateData: any = {
      updatedAt: new Date()
    }

    if (validatedData.customerName) updateData.customerName = validatedData.customerName
    if (validatedData.customerEmail) updateData.customerEmail = validatedData.customerEmail
    if (validatedData.customerPhone) updateData.customerPhone = validatedData.customerPhone
    if (validatedData.reservationDate) updateData.reservationDate = new Date(validatedData.reservationDate)
    if (validatedData.numberOfGuests) updateData.numberOfGuests = validatedData.numberOfGuests
    if (validatedData.specialRequests !== undefined) updateData.specialRequests = validatedData.specialRequests
    if (validatedData.status) updateData.status = validatedData.status

    // Mettre à jour la réservation
    const [updatedReservation] = await db
      .update(reservations)
      .set(updateData)
      .where(eq(reservations.id, id))
      .returning()

    if (!updatedReservation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Réservation non trouvée'
      })
    }

    return {
      success: true,
      data: updatedReservation,
      message: 'Réservation mise à jour avec succès'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    // Erreur de validation Zod
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    console.error('Erreur lors de la mise à jour de la réservation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour de la réservation'
    })
  }
})
