<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import Notification from './Notification.vue';

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
    priority: number;
}

const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);
const notification = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const isExpanded = ref(false);
const electives = ref<Elective[]>([]);
const draggedIndex = ref<number | null>(null);

function showNotification(message: string, type: 'success' | 'error') {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
}

function toggleBox() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    fetchMyElectives();
  }
}

function onDragStart(index: number) {
  draggedIndex.value = index;
}

function onDrop(index: number) {
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    const draggedCard = electives.value[draggedIndex.value];
    if (!draggedCard) return;
    electives.value.splice(draggedIndex.value, 1);
    electives.value.splice(index, 0, draggedCard);
    draggedIndex.value = null;
  }
}

async function saveOrder() {
  let updatedElectives = electives.value.map(({ _id }: Elective, index: number) => ({
    elective_id: _id,
    priority: index + 1,
  }));
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/students/changePriorities`,
      { newPriorities: updatedElectives },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      showNotification('Order saved successfully!', 'success');
    }
  } catch (err: any) {
    console.log(err);
    error.value = 'Something went wrong';
    showNotification('Failed to save order.', 'error');
  } finally {
    loading.value = false;
  }
}

async function fetchMyElectives() {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/students/myElectives`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    console.log(response);

    if (response.data.success) {
      let arr = response.data.data as Elective[];
      arr.sort((a: Elective, b: Elective) => a.priority - b.priority);
      electives.value = arr;
    }
  } catch (err: any) {
    console.log(err);
    error.value = 'Something went wrong';
    showNotification('Failed to fetch electives.', 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="expandable-box" :class="{ 'expanded': isExpanded }">
    <div class="header" @click="toggleBox">
      <span class="arrow" v-if="!isExpanded">▲</span>
      <span class="title" v-else>Update Elective Choice order</span>
    </div>
    <div class="content" v-if="isExpanded">
      <div
        class="card"
        v-for="(card, index) in electives"
        :key="card._id"
        :draggable="true"
        @dragstart="onDragStart(index)"
        @dragover.prevent
        @drop="onDrop(index)"
      >
        <span class="drag-icon">☰</span>
        {{ card.name }}
      </div>
      <button class="save-button" @click="saveOrder">Save</button>
    </div>
    <Notification v-if="notification" :message="notification.message" :type="notification.type" />
  </div>
</template>

<style scoped>
.expandable-box {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: width 0.3s, height 0.3s;
  width: 60px;
  height: 60px;
  z-index: 999;
}

.expandable-box.expanded {
  width: 300px;
  height: 400px;
}

.header {
  background: linear-gradient(135deg, var(--primary), #ff9999);
  color: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.arrow {
  font-size: 18px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.content {
  padding: 15px;
  overflow-y: auto;
  max-height: calc(100% - 50px);
}

.card {
  background: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.drag-icon {
  margin-right: 10px;
  font-size: 16px;
  color: #888;
}

.save-button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background: #b30022;
}
</style>