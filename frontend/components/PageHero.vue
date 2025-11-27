<template>
  <section class="hero hero--center">
    <div class="hero__content hero__content--center">
      <p v-if="subtitle" class="pill pill--ghost">{{ subtitle }}</p>
      <h1>{{ title }}</h1>
      <p class="lede">{{ description }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  description: string;
}>();
</script>
