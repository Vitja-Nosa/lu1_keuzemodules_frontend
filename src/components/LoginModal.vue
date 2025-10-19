<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

const authStore = useAuthStore();
const emit = defineEmits(['close', 'done']);

const loading = ref(false)
const error = ref<string | null>(null)

function closeModal() {
  emit("close");
}

async function login() {
  loading.value = true
  error.value = null

  try {
    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, { email, password })

    if (response.data.token) {
      authStore.login(response.data.token);
      closeModal()
      emit("done");
    }
  } catch (err: any) {
    console.log(err)
    error.value = 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="custom-modal">
      <h2>Login</h2>
      <p>Please log in to enroll in this elective.</p>
      
      <form @submit.prevent="login" class="login-form">

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-control" 
            placeholder="Enter your student email" 
            aria-label="Email" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            class="form-control" 
            placeholder="Enter your password" 
            aria-label="Password" 
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal" :disabled="loading">Cancel</button>
          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.custom-modal h2 {
  margin-bottom: 1rem;
  color: var(--primary);
}

.custom-modal p {
  margin-bottom: 1.5rem;
  color: var(--text);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text);
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.login-btn {
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #0056b3;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #d6d6d6;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
</style>
