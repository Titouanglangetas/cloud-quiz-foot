<template>
  <div class="page">
    <NuxtRouteAnnouncer />
    
    <!-- Drawer -->
    <div class="drawer" :class="{ 'drawer--open': drawerOpen }">
      <div class="drawer__backdrop" @click="drawerOpen = false"></div>
      <aside class="drawer__panel">
        <div class="drawer__head">
          <h4>Bibliotheque des quizzes</h4>
          <button class="icon-button icon-button--ghost" @click="drawerOpen = false" aria-label="Fermer le menu">X</button>
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

    <main class="layout">
      <div class="layout__actions">
        <button class="icon-button" @click="drawerOpen = true" aria-label="Ouvrir le menu des quizzes">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Hero -->
      <section class="hero hero--center">
        <div class="hero__content hero__content--center">
          <p class="pill pill--ghost">{{ hero.subtitle }}</p>
          <h1>{{ hero.title }}</h1>
          <p class="lede">{{ hero.description }}</p>
        </div>
      </section>

      <!-- Quiz Grid -->
      <section class="section">
        <div class="section__head">
          <div>
            <p class="pill pill--ghost">Quizzes disponibles</p>
            <h2>Selection football</h2>
          </div>
          <button class="btn btn--text" @click="drawerOpen = true">Ouvrir le menu</button>
        </div>
        <div class="grid grid--wide">
          <article v-for="quiz in quizzes" :key="quiz.title" class="card card--quiz">
            <div class="quiz__badge" :style="{ background: quiz.accent }"></div>
            <h3>{{ quiz.title }}</h3>
            <p class="card__lede">{{ quiz.description }}</p>
            <div class="card__row card__row--footer">
              <span class="meta">{{ quiz.meta }}</span>
              <button class="btn btn--primary btn--small">Jouer</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import '../assets/styles/main.css';
import { ref } from 'vue';

const drawerOpen = ref(false);

const hero = {
  title: 'Football quizzes, games et trivia',
  subtitle: 'Play football games',
  description: 'Titre centre, description concise, puis la liste des quizzes a lancer.'
};

const quizzes = [
  {
    title: 'Tenaball',
    description: 'Trouve les 10 reponses tenables.',
    accent: 'linear-gradient(135deg, #1aff8d, #13324f)',
    meta: 'Top 10 - rapide'
  },
  {
    title: 'Football Bingo',
    description: 'Remplis la carte bingo en un minimum de coups.',
    accent: 'linear-gradient(135deg, #b3ff3d, #2a2742)',
    meta: 'Multiplayer - bingo'
  },
  {
    title: 'Missing XI',
    description: 'Retrouve le onze de depart d un match culte.',
    accent: 'linear-gradient(135deg, #38f2d2, #0c2236)',
    meta: 'Lineup - medium'
  },
  {
    title: 'Goalless',
    description: 'Les reponses les plus rares marquent le plus.',
    accent: 'linear-gradient(135deg, #5f48ff, #1b1f3a)',
    meta: 'Solo - challenge'
  },
  {
    title: 'Guess the Career',
    description: 'Recompose la carriere d un joueur mystere.',
    accent: 'linear-gradient(135deg, #ff8f3d, #312135)',
    meta: 'Parcours - story'
  },
  {
    title: 'Retro Kits',
    description: 'Associe des maillots vintage a leurs clubs.',
    accent: 'linear-gradient(135deg, #7df0c0, #12282f)',
    meta: 'Culture club - visuel'
  },
  {
    title: 'Draft Builder',
    description: 'Compose ton onze ideal en mode draft.',
    accent: 'linear-gradient(135deg, #2ad4ff, #112434)',
    meta: 'Builder - tactique'
  },
  {
    title: 'Penalty Shootout',
    description: 'Serie de questions rapides comme une seance de tirs au but.',
    accent: 'linear-gradient(135deg, #f9ef6b, #352c19)',
    meta: 'Rapide - pression'
  }
];
</script>
