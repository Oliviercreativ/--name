import { pgTable, serial, varchar, timestamp, integer, text, pgEnum } from 'drizzle-orm/pg-core'

// Enum pour le statut des réservations
export const reservationStatusEnum = pgEnum('reservation_status', ['pending', 'confirmed', 'cancelled', 'completed'])

// Table des réservations
export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),

  // Informations client
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),

  // Détails de la réservation
  reservationDate: timestamp('reservation_date').notNull(),
  numberOfGuests: integer('number_of_guests').notNull(),
  specialRequests: text('special_requests'),

  // Statut et suivi
  status: reservationStatusEnum('status').default('pending').notNull(),

  // Métadonnées
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Reservation = typeof reservations.$inferSelect
export type NewReservation = typeof reservations.$inferInsert
