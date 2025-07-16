import type { RestaurantSuggestion } from 'src/types';

<template>
  <q-page class="q-pa-md">
    <div class="column items-center q-gutter-md">
      <div class="text-h4 text-primary">Smart Restaurant Finder</div>
      
      <q-btn
        label="Find Restaurants Near Me"
        color="primary"
        icon="search"
        @click="handleFindRestaurants"
        :loading="isLoading"
        :disable="isLoading"
      />
      
      <q-inner-loading :showing="isLoading" />

      <q-banner v-if="error" class="bg-negative text-white">
        {{ error }}
        <template v-slot:action>
          <q-btn flat color="white" label="Retry" @click="handleFindRestaurants" />
        </template>
      </q-banner>

      <div v-if="suggestions.length > 0" class="full-width q-mt-lg">
        <div class="text-h5 q-mb-md text-center">Recommended Restaurants</div>
        
        <div class="row q-col-gutter-md justify-center">
          <div 
            v-for="(restaurant, index) in suggestions" 
            :key="index" 
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="my-card" bordered>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ restaurant.name }}</div>
                <div class="text-subtitle2">{{ restaurant.cuisine }} cuisine</div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-weight-medium q-mb-xs">📍 Address:</div>
                <div class="q-mb-sm">{{ restaurant.address }}</div>
                
                <div class="text-weight-medium q-mb-xs">🍽️ Recommended Dish:</div>
                <div class="q-mb-sm">{{ restaurant.suggestedDish }}</div>
                
                <div class="text-weight-medium q-mb-xs">ℹ️ Why this choice:</div>
                <div>{{ restaurant.justification }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { getSuggestions } from 'src/services/api';
import { RestaurantSuggestion } from 'src/types';

const $q = useQuasar();

const isLoading = ref(false);
const error = ref<string | null>(null);
const suggestions = ref<RestaurantSuggestion[]>([]);

const handleFindRestaurants = async () => {
  isLoading.value = true;
  error.value = null;
  suggestions.value = [];
  
  try {
    const position = await getCurrentPosition();
    const suggestionsResponse = await getSuggestions({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    suggestions.value = suggestionsResponse;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to get restaurant suggestions';
    $q.notify({
      type: 'negative',
      message: error.value,
      position: 'top'
    });
  } finally {
    isLoading.value = false;
  }
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    }
    
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => {
        reject(new Error(`Failed to get location: ${err.message}`));
      },
      { timeout: 10000 }
    );
  });
};
</script>

<style scoped>
.my-card {
  min-height: 350px;
  transition: transform 0.3s;
}

.my-card:hover {
  transform: translateY(-5px);
}
</style>