<script setup lang="ts">
import { useRouter } from 'vue-router'
import JobMatch from '@/components/JobMatch.vue'

const router = useRouter()
</script>

<template>
  <div class="library-page">
    <div class="library-inner">
      <header class="page-header">
        <button class="btn-back" @click="router.push('/')">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M15 9H3M3 9L7 5M3 9L7 13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          返回
        </button>
        <h1 class="page-title">人才库</h1>
      </header>
      <JobMatch />
    </div>
  </div>
</template>

<style scoped>
.library-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.library-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.5px;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
