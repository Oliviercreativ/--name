import { desc } from 'drizzle-orm'
import { reservations } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    const db = useDB()

    // Récupérer toutes les réservations, triées par date de création (plus récentes en premier)
    const allReservations = await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt))

    return {
      success: true,
      data: allReservations
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des réservations'
    })
  }
})
