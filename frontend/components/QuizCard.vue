<template>
  <article class="card card--quiz">
    <div class="quiz__badge" :style="{ background: accent }"></div>
    <h3>{{ title }}</h3>
    <p class="card__lede">{{ description }}</p>
    <div class="card__row card__row--footer">
      <span class="meta">{{ meta }}</span>
      <button class="btn btn--primary btn--small">Jouer</button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  accent: string;
  meta: string;
}>();
</script>
