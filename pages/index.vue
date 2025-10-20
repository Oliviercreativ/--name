<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Le Bon Resto</h1>
            <p class="text-gray-600">Cuisine française authentique</p>
          </div>
          <UButton
            to="/admin"
            color="gray"
            variant="ghost"
            icon="i-heroicons-cog-6-tooth"
          >
            Administration
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Info Section -->
        <div>
          <h2 class="text-4xl font-bold text-gray-900 mb-6">
            Réservez votre table
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            Profitez d'une expérience culinaire exceptionnelle dans notre restaurant.
            Réservez facilement votre table en quelques clics.
          </p>

          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-clock" class="text-orange-600 text-xl mt-1" />
              <div>
                <h3 class="font-semibold text-gray-900">Horaires</h3>
                <p class="text-gray-600">Mardi - Dimanche: 12h - 14h30 & 19h - 22h30</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-map-pin" class="text-orange-600 text-xl mt-1" />
              <div>
                <h3 class="font-semibold text-gray-900">Adresse</h3>
                <p class="text-gray-600">123 Rue de la Gastronomie, 75001 Paris</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <UIcon name="i-heroicons-phone" class="text-orange-600 text-xl mt-1" />
              <div>
                <h3 class="font-semibold text-gray-900">Téléphone</h3>
                <p class="text-gray-600">01 23 45 67 89</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reservation Form -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Formulaire de réservation</h3>

          <UForm :state="form" @submit="submitReservation" class="space-y-6">
            <UFormGroup label="Nom complet" name="customerName" required>
              <UInput
                v-model="form.customerName"
                placeholder="Jean Dupont"
                icon="i-heroicons-user"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Email" name="customerEmail" required>
              <UInput
                v-model="form.customerEmail"
                type="email"
                placeholder="jean.dupont@example.com"
                icon="i-heroicons-envelope"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Téléphone" name="customerPhone" required>
              <UInput
                v-model="form.customerPhone"
                type="tel"
                placeholder="06 12 34 56 78"
                icon="i-heroicons-phone"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Date et heure" name="reservationDate" required>
              <UInput
                v-model="form.reservationDate"
                type="datetime-local"
                icon="i-heroicons-calendar"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Nombre de personnes" name="numberOfGuests" required>
              <UInput
                v-model.number="form.numberOfGuests"
                type="number"
                min="1"
                max="20"
                placeholder="2"
                icon="i-heroicons-user-group"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Demandes spéciales" name="specialRequests">
              <UTextarea
                v-model="form.specialRequests"
                placeholder="Allergies, régime alimentaire, occasion spéciale..."
                :rows="3"
              />
            </UFormGroup>

            <UButton
              type="submit"
              color="orange"
              size="lg"
              block
              :loading="loading"
              icon="i-heroicons-check-circle"
            >
              Confirmer la réservation
            </UButton>
          </UForm>

          <!-- Success Message -->
          <UAlert
            v-if="success"
            color="green"
            variant="soft"
            title="Réservation confirmée !"
            description="Nous avons bien reçu votre réservation. Un email de confirmation vous a été envoyé."
            class="mt-6"
            icon="i-heroicons-check-circle"
          />

          <!-- Error Message -->
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            title="Erreur"
            :description="error"
            class="mt-6"
            icon="i-heroicons-exclamation-circle"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  reservationDate: '',
  numberOfGuests: 2,
  specialRequests: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

const submitReservation = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    const response = await $fetch('/api/reservations', {
      method: 'POST',
      body: {
        ...form.value,
        // Convertir la date en format ISO
        reservationDate: new Date(form.value.reservationDate).toISOString()
      }
    })

    if (response.success) {
      success.value = true
      // Réinitialiser le formulaire
      form.value = {
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        reservationDate: '',
        numberOfGuests: 2,
        specialRequests: ''
      }

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        success.value = false
      }, 5000)
    }
  } catch (err: any) {
    console.error('Erreur lors de la réservation:', err)
    error.value = err.data?.statusMessage || 'Une erreur est survenue lors de la réservation'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Réserver une table - Le Bon Resto'
})
</script>
