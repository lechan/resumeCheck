<script setup lang="ts">
import type { InterviewQuestionResponse } from '@/types/resume'

defineProps<{
  data: InterviewQuestionResponse | null
  loading: boolean
}>()

function diffColor(d: string) {
  const map: Record<string, string> = { easy: '#22c55e', medium: '#eab308', hard: '#f97316' }
  return map[d] || '#6b7280'
}
function diffLabel(d: string) {
  const map: Record<string, string> = { easy: '简单', medium: '中等', hard: '困难' }
  return map[d] || d
}
</script>

<template>
  <div class="interview-panel">
    <h3 class="section-title">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" />
        <path
          d="M7 8a3 3 0 1 1 6 0c0 2-3 4-3 4s-3-2-3-4Z"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <circle cx="10" cy="15" r="0.75" fill="currentColor" />
      </svg>
      面试题推荐
      <span class="badge" v-if="data">{{ data.candidate_name }}</span>
    </h3>

    <div class="loading-spot" v-if="loading">
      <div class="spinner-small"></div>
      <span>正在生成面试题...</span>
    </div>

    <div class="questions-list" v-if="data && data.items.length && !loading">
      <div v-for="q in data.items" :key="q.question_id" class="q-card">
        <div class="q-header">
          <span class="q-category">{{ q.category }}</span>
          <span class="q-diff" :style="{ background: diffColor(q.difficulty) }">
            {{ diffLabel(q.difficulty) }}
          </span>
        </div>
        <p class="q-text">{{ q.question }}</p>
        <p class="q-rationale" v-if="q.rationale">{{ q.rationale }}</p>
        <div class="q-signals" v-if="q.expected_signals.length">
          <span class="q-signal" v-for="s in q.expected_signals" :key="s">{{ s }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interview-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-accent);
  background: rgba(0, 136, 204, 0.08);
  border-radius: 4px;
  padding: 1px 8px;
}

.loading-spot {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 16px 0;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.q-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.q-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.q-category {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.q-diff {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  padding: 1px 8px;
  border-radius: 4px;
}

.q-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0;
}

.q-rationale {
  font-size: 12px;
  color: var(--color-text-muted);
  font-style: italic;
  margin: 0;
}

.q-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.q-signal {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(99, 91, 255, 0.07);
  border: 1px solid rgba(99, 91, 255, 0.15);
  color: var(--color-accent-secondary);
}
</style>
