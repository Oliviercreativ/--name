<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administration</h1>
            <p class="text-gray-600">Gestion des réservations</p>
          </div>
          <UButton
            to="/"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
          >
            Retour à l'accueil
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ reservations.length }}</p>
            </div>
            <UIcon name="i-heroicons-calendar" class="text-gray-400 text-3xl" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
            </div>
            <UIcon name="i-heroicons-clock" class="text-yellow-400 text-3xl" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Confirmées</p>
              <p class="text-2xl font-bold text-green-600">{{ confirmedCount }}</p>
            </div>
            <UIcon name="i-heroicons-check-circle" class="text-green-400 text-3xl" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Annulées</p>
              <p class="text-2xl font-bold text-red-600">{{ cancelledCount }}</p>
            </div>
            <UIcon name="i-heroicons-x-circle" class="text-red-400 text-3xl" />
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <UTabs v-model="selectedTab" :items="tabs" class="p-4" />
      </div>

      <!-- Reservations Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-gray-400 mb-2" />
          <p class="text-gray-600">Chargement des réservations...</p>
        </div>

        <div v-else-if="filteredReservations.length === 0" class="p-12 text-center">
          <UIcon name="i-heroicons-inbox" class="text-6xl text-gray-300 mb-4" />
          <p class="text-gray-600">Aucune réservation {{ selectedTab === 'all' ? '' : statusLabel }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnes
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="reservation in filteredReservations" :key="reservation.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span class="text-orange-600 font-semibold">
                        {{ reservation.customerName.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ reservation.customerName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ reservation.customerEmail }}</div>
                  <div class="text-sm text-gray-500">{{ reservation.customerPhone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(reservation.reservationDate) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(reservation.reservationDate) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ reservation.numberOfGuests }} pers.
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :color="getStatusColor(reservation.status)"
                    variant="soft"
                  >
                    {{ getStatusLabel(reservation.status) }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <UDropdown
                    :items="getActionItems(reservation)"
                    :popper="{ placement: 'bottom-end' }"
                  >
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-ellipsis-vertical"
                    />
                  </UDropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Detail Modal -->
    <UModal v-model="showDetailModal" :ui="{ width: 'max-w-2xl' }">
      <div class="p-6" v-if="selectedReservation">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Détails de la réservation</h3>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Client</label>
            <p class="text-gray-900">{{ selectedReservation.customerName }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Email</label>
              <p class="text-gray-900">{{ selectedReservation.customerEmail }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Téléphone</label>
              <p class="text-gray-900">{{ selectedReservation.customerPhone }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Date & Heure</label>
              <p class="text-gray-900">
                {{ formatDate(selectedReservation.reservationDate) }} à {{ formatTime(selectedReservation.reservationDate) }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Nombre de personnes</label>
              <p class="text-gray-900">{{ selectedReservation.numberOfGuests }}</p>
            </div>
          </div>

          <div v-if="selectedReservation.specialRequests">
            <label class="text-sm font-medium text-gray-700">Demandes spéciales</label>
            <p class="text-gray-900">{{ selectedReservation.specialRequests }}</p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">Statut</label>
            <UBadge
              :color="getStatusColor(selectedReservation.status)"
              variant="soft"
              class="mt-1"
            >
              {{ getStatusLabel(selectedReservation.status) }}
            </UBadge>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <label class="font-medium">Créée le</label>
              <p>{{ formatDateTime(selectedReservation.createdAt) }}</p>
            </div>
            <div>
              <label class="font-medium">Modifiée le</label>
              <p>{{ formatDateTime(selectedReservation.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <UButton color="gray" variant="ghost" @click="showDetailModal = false">
            Fermer
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
        </p>
        <div class="flex justify-end space-x-3">
          <UButton color="gray" variant="ghost" @click="showDeleteModal = false">
            Annuler
          </UButton>
          <UButton color="red" @click="confirmDelete" :loading="deleting">
            Supprimer
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Reservation {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  reservationDate: string
  numberOfGuests: number
  specialRequests: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

const reservations = ref<Reservation[]>([])
const loading = ref(true)
const selectedTab = ref('all')
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const selectedReservation = ref<Reservation | null>(null)
const reservationToDelete = ref<number | null>(null)
const deleting = ref(false)

const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'completed', label: 'Terminées' }
]

// Computed
const filteredReservations = computed(() => {
  if (selectedTab.value === 'all') return reservations.value
  return reservations.value.filter(r => r.status === selectedTab.value)
})

const pendingCount = computed(() => reservations.value.filter(r => r.status === 'pending').length)
const confirmedCount = computed(() => reservations.value.filter(r => r.status === 'confirmed').length)
const cancelledCount = computed(() => reservations.value.filter(r => r.status === 'cancelled').length)

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    pending: 'en attente',
    confirmed: 'confirmée',
    cancelled: 'annulée',
    completed: 'terminée'
  }
  return labels[selectedTab.value] || ''
})

// Methods
const fetchReservations = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; data: Reservation[] }>('/api/reservations')
    if (response.success) {
      reservations.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des réservations:', error)
  } finally {
    loading.value = false
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'yellow',
    confirmed: 'green',
    cancelled: 'red',
    completed: 'gray'
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminée'
  }
  return labels[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewDetails = (reservation: Reservation) => {
  selectedReservation.value = reservation
  showDetailModal.value = true
}

const updateStatus = async (reservation: Reservation, newStatus: string) => {
  try {
    await $fetch(`/api/reservations/${reservation.id}`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    await fetchReservations()
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  }
}

const deleteReservation = (id: number) => {
  reservationToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!reservationToDelete.value) return

  deleting.value = true
  try {
    await $fetch(`/api/reservations/${reservationToDelete.value}`, {
      method: 'DELETE'
    })
    await fetchReservations()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    deleting.value = false
    reservationToDelete.value = null
  }
}

const getActionItems = (reservation: Reservation) => {
  const items = [[
    {
      label: 'Voir les détails',
      icon: 'i-heroicons-eye',
      click: () => viewDetails(reservation)
    }
  ]]

  const statusActions = []
  if (reservation.status !== 'confirmed') {
    statusActions.push({
      label: 'Confirmer',
      icon: 'i-heroicons-check-circle',
      click: () => updateStatus(reservation, 'confirmed')
    })
  }
  if (reservation.status !== 'cancelled') {
    statusActions.push({
      label: 'Annuler',
      icon: 'i-heroicons-x-circle',
      click: () => updateStatus(reservation, 'cancelled')
    })
  }
  if (reservation.status !== 'completed') {
    statusActions.push({
      label: 'Marquer comme terminée',
      icon: 'i-heroicons-check-badge',
      click: () => updateStatus(reservation, 'completed')
    })
  }

  if (statusActions.length > 0) {
    items.push(statusActions)
  }

  items.push([{
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: () => deleteReservation(reservation.id)
  }])

  return items
}

// Load reservations on mount
onMounted(() => {
  fetchReservations()
})

useHead({
  title: 'Administration - Le Bon Resto'
})
</script>
