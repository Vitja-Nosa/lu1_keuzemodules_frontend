<script setup lang="ts">
    import type { PropType } from 'vue'
    import { useRouter } from 'vue-router'
    import { computed, ref, watch } from 'vue'

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

    const props = defineProps<{
    elective: Elective
    }>()

    const router = useRouter()

    function go() {
      console.log(props.elective)
      if (!props.elective?._id) return
      router.push({ path: `/electives/${props.elective._id}` })
    }

    function pickKeyword(name?: string) {
    if (!name) return ''
    const n = name.toLowerCase()
    if (/\b(program|code|computer|software|web|dev|ai|data)\b/.test(n)) return 'technology'
    if (/\b(math|statistics|algebra|geometry|calculus)\b/.test(n)) return 'math'
    if (/\b(art|design|painting|sculpture|graphic|ux|ui|media|music)\b/.test(n)) return 'art'
    if (/\b(bio|biology|ecology|environment|plant|animal|zoology)\b/.test(n)) return 'nature'
    if (/\b(chemistry|chem)\b/.test(n)) return 'chemistry'
    if (/\b(physics|astronomy|astro)\b/.test(n)) return 'science'
    if (/\b(history|culture|society|politics)\b/.test(n)) return 'history'
    return ''
    }

    function placeimgCategory(keyword: string) {
    if (!keyword) return 'any'
    if (/(tech|technology|computer|code|dev)/.test(keyword)) return 'tech'
    if (/(nature|bio|biology|plant|animal|ecology)/.test(keyword)) return 'nature'
    if (/(art|design|music)/.test(keyword)) return 'architecture'
    if (/(people|history|culture|society)/.test(keyword)) return 'people'
    return 'any'
    }

    function escapeForSvgText(s: string) {
    return String(s).replace(/&/g, '&amp;').replace(/#/g, '%23').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }

    const imageCandidates = computed(() => {
    const name = props.elective?.name?.trim() || ''
    const keyword = pickKeyword(name)
    const seed = encodeURIComponent(props.elective?._id ?? name ?? 'elective')
    const candidates: string[] = []

    if (keyword) candidates.push(`https://source.unsplash.com/600x400/?${encodeURIComponent(keyword)}`)
    if (name) candidates.push(`https://source.unsplash.com/600x400/?${encodeURIComponent(name)}`)

    candidates.push(`https://picsum.photos/seed/${seed}/600/400`)

    const placeCategory = placeimgCategory(keyword)
    candidates.push(`https://placeimg.com/600/400/${placeCategory}`)

    const svgText = escapeForSvgText(name || 'Elective')
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23C6002A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Arial,Helvetica,sans-serif'>${svgText}</text></svg>`
    const svgUrl = `data:image/svg+xml;utf8,${svg}`
    candidates.push(svgUrl)

    return candidates
    })

    const imgIndex = ref(0)
    const imgSrc = ref(imageCandidates.value[0])

    watch(imageCandidates, (next) => {
        imgIndex.value = 0
        imgSrc.value = next[0]
    })

    function onImgError(e: Event) {
        if (!(e.target instanceof HTMLImageElement)) return;
        const el = e.target;
        const list = imageCandidates.value;
        if (!list || list.length === 0) return;

        if (imgIndex.value < list.length - 1) {
        imgIndex.value++;
        imgSrc.value = list[imgIndex.value];
        el.src = imageCandidates.value?.[imageCandidates.value.length - 1] ?? '';
        } else {
        el.src = imageCandidates.value?.[imageCandidates.value.length - 1] ?? '';
        }
    } 
</script>

<template>
    <div
      class="card h-100 card-interactive"
      role="button"
      tabindex="0"
      @click="go"
      @keydown.enter.prevent="go"
      @keydown.space.prevent="go"
    >
        <img class="card-img-top" :src="imgSrc" :alt="props.elective.name || 'Elective image'" @error="onImgError">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ props.elective.name }}</h5>
            <p class="card-text" v-if="props.elective.shortdescription">
              {{ props.elective.shortdescription }}
            </p>
            <p class="mb-2"><small class="text-muted">Level: {{ props.elective.level || 'N/A' }} • Credits: {{ props.elective.studycredit ?? 'N/A' }}</small></p>
        </div>
    </div>
</template>

<style scoped>
.card {
  width: 100%;
  background: var(--bg);
  color: var(--text);
  border: 1px solid rgba(0,0,0,0.06);
}

.card-interactive {
  transition: transform 200ms ease, box-shadow 200ms ease;
  cursor: pointer;
  will-change: transform, box-shadow;
  border-radius: 6px;
  background: var(--bg);
}

.card-interactive:hover,
.card-interactive:focus {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 10px var(--shadow-accent);
  outline: none;
}

.card-interactive:focus {
  box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 0 0 4px rgba(198,0,42,0.12);
}

.card-img-top {
  object-fit: cover;
  height: 150px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.card-body { color: var(--text); }
.card-title { color: var(--primary); }
</style>