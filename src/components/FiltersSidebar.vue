<script setup lang="ts">
import type { PropType } from 'vue';
import { watch } from 'vue';

const props = defineProps({
  filters: {
    type: Object as PropType<{
      level: string;
      location: string;
      credit: string
    }>,
    required: true,
  },
  levels: {
    type: Array as PropType<string[]>,
    required: true,
  },
  locations: {
    type: Array as PropType<string[]>,
    required: true,
  },
  credits: {
    type: Array as PropType<number[]>,
    required: true,
  },
});

const emit = defineEmits(['filter-change']);

watch(
  () => props.filters,
  () => {
    emit('filter-change');
  },
  { deep: true }
);
</script>

<template>
  <aside class="filters-sidebar">
    <h3>Filters</h3>

    <div class="filter-group">
      <label for="level">Level</label>
      <select id="level" v-model="filters.level">
        <option value="">All</option>
        <option v-for="lvl in levels" :key="lvl" :value="lvl">{{ lvl }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="location">Location</label>
      <select id="location" v-model="filters.location">
        <option value="">All</option>
        <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="credit">Credit</label>
      <select id="credit" v-model="filters.credit">
        <option value="">Any</option>
        <option v-for="credit in credits" :key="credit" :value="credit">{{ credit }}</option>
      </select>
    </div>

  </aside>
</template>

<style scoped>
.filters-sidebar {
  width: 260px;
  flex: 0 0 260px;
  border-right: 1px solid rgba(0,0,0,0.06);
  padding-right: 1rem;

  position: sticky;
  top: 1rem; 
  align-self: start;
  max-height: calc(100vh);
  height: 100vh;
  overflow: auto;
  background: var(--bg);
  z-index: 2;
}

.filters-sidebar h3 {
  margin-top: 0;
  color: var(--primary);
}

.filter-group {
  margin: 0.75rem 0;
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text);
}

.filter-group select,
.filter-group input[type="number"] {
  padding: 0.4rem 0.5rem;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 4px;
  background: #fff;
  color: var(--text);
}

.credits-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.credits-input { width: 100%; }
.sep { color: #666; }

.filter-actions {
  margin-top: 1rem;
}

.filter-actions button {
  padding: 0.4rem 0.6rem;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>