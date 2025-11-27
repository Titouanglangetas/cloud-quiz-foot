<template>
  <div class="drawer" :class="{ 'drawer--open': open }">
    <div class="drawer__backdrop" @click="$emit('close')"></div>
    <aside class="drawer__panel">
      <div class="drawer__head">
        <h4>Bibliotheque des quizzes</h4>
        <button class="icon-button icon-button--ghost" @click="$emit('close')" aria-label="Fermer le menu">X</button>
      </div>
      <div class="drawer__list">
        <article v-for="quiz in quizzes" :key="quiz.title" class="drawer__item">
          <div class="drawer__accent" :style="quiz.accent ? { background: quiz.accent } : {}"></div>
          <div>
            <div class="drawer__title">{{ quiz.title }}</div>
            <p class="drawer__meta">{{ quiz.meta }}</p>
          </div>
        </article>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
  quizzes: Array<{
    title: string;
    meta: string;
    accent?: string;
  }>;
}>();

defineEmits<{ close: [] }>();
</script>
