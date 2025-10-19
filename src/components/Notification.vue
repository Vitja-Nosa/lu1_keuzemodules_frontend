<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
}

const props = defineProps<Props>();

const visible = ref(true);

watch(
  () => props.message,
  () => {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration ?? 5000);
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="visible" :class="['notification', props.type]">
    {{ props.message }}
  </div>
</template>

<style scoped>
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