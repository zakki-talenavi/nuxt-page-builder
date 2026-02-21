<template>
  <div class="puck-home">
    <div class="puck-home__hero">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M3 9h6" />
      </svg>
      <h1>Puck Editor</h1>
      <p>Visual page builder for Nuxt + Vue + PrimeVue</p>
    </div>
    <div class="puck-home__actions">
      <NuxtLink to="/edit" class="puck-home__btn puck-home__btn--primary">
        Open Editor
      </NuxtLink>
      <NuxtLink to="/view" class="puck-home__btn puck-home__btn--secondary">
        View Page
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.puck-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f9fafb;
}
.puck-home__hero {
  text-align: center;
  margin-bottom: 2rem;
}
.puck-home__hero h1 {
  margin: 16px 0 8px;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}
.puck-home__hero p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}
.puck-home__actions {
  display: flex;
  gap: 12px;
}
.puck-home__btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.puck-home__btn--primary {
  background: #6366f1;
  color: #fff;
}
.puck-home__btn--primary:hover {
  background: #4f46e5;
}
.puck-home__btn--secondary {
  background: #fff;
  color: #6366f1;
  border: 2px solid #e5e7eb;
}
.puck-home__btn--secondary:hover {
  border-color: #6366f1;
}
</style>
