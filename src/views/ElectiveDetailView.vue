<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import LoginModal from '../components/LoginModal.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const route = useRoute();
const router = useRouter();

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

const electiveId = ref(route.params.elective);
const elective = ref<Elective>();
const isEnrolled = ref<Boolean>(false);

const loading = ref(false);
const error = ref<string | null>(null);
const showModal = ref(false);

const notification = ref<{ message: string; type: 'success' | 'error' } | null>(null);

function showNotification(message: string, type: 'success' | 'error') {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 5000); 
}

function goBack() {
  router.back();
}

async function attemptEnroll() {
  if (!authStore.isLoggedIn) {
    showModal.value = true;
    return;
  } else {
    enrollStudent();
  }
}

async function enrollStudent() {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/students/enroll`,
      { elective_id: electiveId.value },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (response.data.success) {
      isEnrolled.value = true;
      showNotification('Successfully enrolled in the elective!', 'success');
    }
  } catch (err: any) {
    console.log(err.response);
    const errorMessage = err.response.data.error || err?.message || 'An error occurred';
    if (errorMessage == "You are already enrolled in this elective") {
      isEnrolled.value = true      
    }
    error.value = errorMessage;
    showNotification(errorMessage, 'error');
  } finally {
    loading.value = false;
  }
}

function successfullLogin() {
  enrollStudent();
}

async function fetchElective(id: String) {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/electives/` + id, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    console.log("fetching elective")

    if (response.data.success) {
      console.log(response.data);
      isEnrolled.value = response.data.enrolled || false
      console.log(isEnrolled);
      elective.value = response.data.data;
    }
  } catch (err: any) {
    error.value = err?.message ?? String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (electiveId.value) {
    await fetchElective(electiveId.value.toString());
  }
});
</script>

<template>
  <main class="detail-page">
    <div class="detail-header">
      <button class="back-btn" @click="goBack">← Go Back</button>
      <h1>{{ elective?.name }}</h1>
    </div>
    <div class="detail-content" v-if="elective">
      <div class="detail-section">
        <p><strong>Short Description:</strong> {{ elective.shortdescription }}</p>
        <p><strong>Description:</strong> {{ elective.description }}</p>
        <p><strong>Content:</strong> {{ elective.content }}</p>
        <p><strong>Study Credit:</strong> {{ elective.studycredit }}</p>
        <p><strong>Location:</strong> {{ elective.location }}</p>
        <p><strong>Level:</strong> {{ elective.level }}</p>
        <p><strong>Learning Outcomes:</strong> {{ elective.learningoutcomes }}</p>
      </div>
      <button v-if="!isEnrolled" class="enroll-btn" @click="attemptEnroll">Enroll</button>
      <button v-else class="btn btn-success" disabled="true">Enrolled</button>
    </div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">Error: {{ error }}</div>
    <LoginModal 
      v-if="showModal"
      @close="showModal = false"
      @done="successfullLogin()"
    />
    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </main>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  padding: 2rem;
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 1rem;
}

.detail-header h1 {
  font-size: 2rem;
  color: var(--primary);
  margin: 0;
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.detail-section p {
  margin: 0.5rem 0;
  line-height: 1.6;
  font-size: 1.1rem;
}

.back-btn, .enroll-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.back-btn {
  background: #e0e0e0;
  color: #333;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #d6d6d6;
}

.enroll-btn {
  align-self: flex-start;
  background: var(--primary);
  color: white;
  font-weight: bold;
  transition: background 0.3s;
}

.enroll-btn:hover {
  background: #0056b3;
}

.loading, .error {
  text-align: center;
  font-size: 1.5rem;
  color: var(--muted);
  margin-top: 2rem;
}

.notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fade-in-out 5s ease-in-out;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #b71c1c;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10%, 90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
