<script setup lang="ts">
import type { RiskReport } from '@/types/resume'

defineProps<{
  report: RiskReport | null
}>()

function severityStyle(severity: string): { bg: string; border: string; text: string } {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    low: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
    medium: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#eab308' },
    high: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', text: '#f97316' },
    critical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  }
  return (map[severity] ?? map.low)!
}

function severityLabel(severity: string) {
  const map: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重',
  }
  return map[severity] || severity
}
</script>

<template>
  <div class="risk-report">
    <h3 class="section-title">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L1 17H19L10 2Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path d="M10 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
      </svg>
      风险详情
      <span class="risk-count" v-if="report">{{ report.risk_items.length }} 项</span>
    </h3>

    <template v-if="report">
      <!-- 摘要 -->
      <div v-if="report.summary.major_findings.length" class="summary-box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="summary-icon">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2" />
          <path
            d="M8 4V8.5M8 11V11.01"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <div class="summary-list">
          <p
            v-for="(finding, idx) in report.summary.major_findings"
            :key="idx"
            class="summary-item"
          >
            {{ finding }}
          </p>
        </div>
      </div>

      <!-- 风险项 -->
      <div class="risk-items" v-if="report.risk_items.length > 0">
        <div
          v-for="item in report.risk_items"
          :key="item.rule_id"
          class="risk-item"
          :style="{
            background: severityStyle(item.severity).bg,
            borderColor: severityStyle(item.severity).border,
          }"
        >
          <div class="risk-item-header">
            <span class="risk-category" :style="{ color: severityStyle(item.severity).text }">
              {{ item.category }}
            </span>
            <span class="risk-severity" :style="{ background: severityStyle(item.severity).text }">
              {{ severityLabel(item.severity) }}
            </span>
          </div>
          <p class="risk-desc">{{ item.description }}</p>
          <div class="risk-evidence" v-if="item.evidence">
            <span class="evidence-label">证据</span>
            <span>{{ item.evidence }}</span>
          </div>
          <div class="risk-suggestion" v-if="item.suggestion">
            <span class="suggestion-label">建议</span>
            <span>{{ item.suggestion }}</span>
          </div>
        </div>
      </div>

      <!-- 无风险项 -->
      <div class="empty-state" v-if="report.risk_items.length === 0">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#22c55e" stroke-width="1.5" />
          <path
            d="M12 20L18 26L28 14"
            stroke="#22c55e"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p>未发现风险项</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.risk-report {
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

.risk-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: var(--color-surface);
  padding: 2px 10px;
  border-radius: 10px;
}

.summary-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
}

.summary-icon {
  color: var(--color-accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-item {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

.risk-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.risk-item {
  border: 1px solid;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.risk-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.risk-category {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-severity {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
}

.risk-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text);
}

.risk-evidence,
.risk-suggestion {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.evidence-label,
.suggestion-label {
  font-weight: 600;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 14px;
}
</style>
