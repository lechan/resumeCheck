<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  level: string
}>()

const circumference = 2 * Math.PI * 54
const offset = computed(() => {
  const pct = Math.min(Math.max(props.score, 0), 100)
  return circumference - (pct / 100) * circumference
})

const gradientId = 'score-gradient'

const levelInfo = computed(() => {
  const map: Record<string, { label: string; color: string }> = {
    low: { label: '低风险', color: '#22c55e' },
    medium: { label: '中风险', color: '#eab308' },
    high: { label: '高风险', color: '#f97316' },
    critical: { label: '严重风险', color: '#ef4444' },
  }
  return map[props.level.toLowerCase()] || { label: props.level, color: '#6b7280' }
})
</script>

<template>
  <div class="score-gauge">
    <svg width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#22c55e" />
          <stop offset="50%" stop-color="#eab308" />
          <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>
      </defs>
      <!-- 背景环 -->
      <circle cx="80" cy="80" r="54" fill="none" stroke="var(--color-border)" stroke-width="10" />
      <!-- 进度环 -->
      <circle
        cx="80"
        cy="80"
        r="54"
        fill="none"
        :stroke="`url(#${gradientId})`"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        transform="rotate(-90 80 80)"
        class="score-ring"
      />
      <!-- 中心文字 -->
      <text x="80" y="72" text-anchor="middle" class="score-value">{{ score }}</text>
      <text x="80" y="98" text-anchor="middle" class="score-label">风险指数</text>
    </svg>

    <div class="score-level" :style="{ color: levelInfo.color, borderColor: levelInfo.color }">
      {{ levelInfo.label }}
    </div>
  </div>
</template>

<style scoped>
.score-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-ring {
  transition: stroke-dashoffset 1s ease-out;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
  fill: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.score-label {
  font-size: 11px;
  fill: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.score-level {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 14px;
  border: 1px solid;
  border-radius: 20px;
  letter-spacing: 0.5px;
}
</style>
