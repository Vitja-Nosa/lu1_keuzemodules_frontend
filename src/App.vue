<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
:root{
  --primary: #C6002A;
  --bg: #ffffff;
  --text: #111111;
  --muted: #666666;
  --shadow-accent: rgba(198,0,42,0.18);
}

/* apply background/text globally */
html,body,#app {
  background: var(--bg);
  color: var(--text);
  height: 100%;
  margin: 0;
}

/* logos */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em var(--shadow-accent));
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em var(--shadow-accent));
}

/* nav styling */
nav {
  padding: 0.5rem 1rem;
}
nav a {
  color: var(--primary);
  text-decoration: none;
  margin: 0 0.5rem;
}
nav a:hover, nav a:focus {
  text-decoration: underline;
}
</style>
