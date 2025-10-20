import { eq } from 'drizzle-orm'
import { reservations } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, 'id') || '0')

    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID invalide'
      })
    }

    const db = useDB()

    // Supprimer la réservation
    const [deletedReservation] = await db
      .delete(reservations)
      .where(eq(reservations.id, id))
      .returning()

    if (!deletedReservation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Réservation non trouvée'
      })
    }

    return {
      success: true,
      message: 'Réservation supprimée avec succès'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Erreur lors de la suppression de la réservation:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de la réservation'
    })
  }
})
