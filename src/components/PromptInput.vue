<script setup lang="ts">
import { useResumeStore } from '@/stores/resume'

const store = useResumeStore()
</script>

<template>
  <div class="prompt-input">
    <div class="prompt-header">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 2H2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M15 18H18V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M18 5V2H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M2 15V18H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/>
      </svg>
      <span>AI 分析提示词</span>
    </div>
    <textarea
      v-model="store.promptText"
      class="prompt-textarea"
      placeholder="输入额外的分析指令，如：重点关注候选人的跳槽频率、技术栈匹配度..."
      rows="3"
    ></textarea>
  </div>
</template>

<style scoped>
.prompt-input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  transition: border-color 0.3s;
}

.prompt-input:focus-within {
  border-color: var(--color-accent);
}

.prompt-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
}

.prompt-textarea {
  width: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 13px;
  line-height: 1.6;
  padding: 12px;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
  font-family: inherit;
  box-sizing: border-box;
}

.prompt-textarea:focus {
  border-color: var(--color-accent);
}

.prompt-textarea::placeholder {
  color: var(--color-text-muted);
}
</style>
