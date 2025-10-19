<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import ElectiveCard from '../components/ElectiveCard.vue';
  import FiltersSidebar from '../components/FiltersSidebar.vue';
  import LoginModal from '../components/LoginModal.vue';

  interface Elective {
    _id: string;
    name: string;
    shortdescription: string;
    description: string;
    content: string;
    studycredit: number;
    location: number;
    level: string;
    learningoutcomes: string;
  }

  const LIMIT = 30
  const electives = ref<Elective[]>([])

  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = ref({
    level: '',
    location: '',
    credit: ''
  })

  async function fetchElectives(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('http://localhost:3000/electives', {
        params: {
          page,
          limit: LIMIT,
          location: filters.value.location || undefined,
          level: filters.value.level || undefined,
          studycredit: filters.value.credit || undefined
        },
      })
      console.log(response)

      if (response.data.success) {
        const data = response.data.data
        electives.value = data.electives || []
        const tot = data.total
        const pages = data.totalPages

        totalItems.value = Number(tot)
        totalPages.value = Number(pages)
        currentPage.value = Number(page)
      }
    } catch (err: any) {
      error.value = err?.message ?? String(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await fetchElectives(currentPage.value)
  })

  const levels = ["NLQF5", "NLQF6"];
  const locations = ["Breda en Den Bosch", "Breda", "Den Bosch en Tilburg", "Den Bosch", "Tilburg"];
  const credits = [15, 30]

  async function gotoPage(page: number) {
    if (page < 1 || page > totalPages.value || loading.value) return
    await fetchElectives(page)
    const cards = document.querySelector('.cards-column')
    if (cards) cards.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function prevPage() { gotoPage(Math.max(1, currentPage.value - 1)) }
  function nextPage() { gotoPage(Math.min(totalPages.value, currentPage.value + 1)) }

  const visiblePages = computed(() => {
    console.log("TESTINGGGG")
    const maxButtons = 5
    const pages: number[] = []
    const total = totalPages.value
    const current = currentPage.value
    if (total <= maxButtons) {
      for (let i = 1; i <= total; i++) pages.push(i)
      return pages
    }
    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)
    if (start === 1) end = Math.min(total, maxButtons)
    if (end === total) start = Math.max(1, total - (maxButtons - 1))
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  })

  async function handleFilterChange() {
    if (loading.value == false) {
      await fetchElectives(currentPage.value);
    }
  }
</script>

<template>
  <main>
    <div class="layout">
      <FiltersSidebar
        :filters="filters"
        :levels="levels"
        :locations="locations"
        :credits="credits"
        @filter-change="handleFilterChange"
      />

      <div class="row">
        <section class="cards-column">
          <div v-if="loading" class="loading">Loading...</div>
          <div v-if="error" class="error">Error: {{ error }}</div>
          <div v-if="!loading && !electives.length" class="empty">No electives found</div>

          <ElectiveCard
            v-for="elective in electives"
            :key="elective._id"
            :elective="elective"
          />
        </section>

        <nav class="pagination justify-content-center" aria-label="Electives pagination">
          <button class="page-btn" :disabled="loading || currentPage === 1" @click="prevPage">Prev</button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            :disabled="loading"
            @click="gotoPage(p)"
          >
            {{ p }}
          </button>

          <button class="page-btn" :disabled="loading || currentPage === totalPages" @click="nextPage">Next</button>

          <div class="pagination-meta">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <span v-if="totalItems"> — {{ totalItems }} items</span>
          </div>
        </nav>
      </div>
    </div>
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

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

.cards-column {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 1rem;
  align-items: start;
  width: 100%;
  box-sizing: border-box;
  padding: 0;
}

.cards-column > * {
  width: 100%;
}

.empty, .hint, small { color: var(--muted); }

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.page-btn {
  padding: 0.35rem 0.6rem;
  border: 1px solid rgba(0,0,0,0.08);
  background: white;
  color: var(--text);
  border-radius: 4px;
  cursor: pointer;
}
.page-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-btn.active {
  background: var(--primary);
  color: white;
  border-color: rgba(0,0,0,0.06);
}
.pagination-meta {
  margin-left: 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .cards-column {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .cards-column {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 780px) {
  .layout {
    flex-direction: column;
  }
  .filters-sidebar {
    width: auto;
    flex: none;
    border-right: none;
    padding-right: 0;
    padding-bottom: 0.5rem;

    position: static;
    max-height: none;
    overflow: visible;
  }
}

.cards-column { padding-bottom: 1rem; }
.loading, .error { padding: 0.5rem 0; color: var(--muted); }
</style>
