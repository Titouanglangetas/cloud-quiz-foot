<template>
  <section class="section">
    <div class="section__head">
      <div>
        <p class="pill pill--ghost">Quizzes disponibles</p>
        <h2>Selection football</h2>
      </div>
      <slot name="actions"></slot>
    </div>
    <div class="grid grid--wide">
      <QuizCard
        v-for="quiz in quizzes"
        :key="quiz.title"
        :title="quiz.title"
        :description="quiz.description"
        :meta="quiz.meta"
        :accent="quiz.accent"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  quizzes: Array<{
    title: string;
    description: string;
    accent: string;
    meta: string;
  }>;
}>();
</script>
