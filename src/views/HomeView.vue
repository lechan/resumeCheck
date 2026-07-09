<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import UploadZone from '@/components/UploadZone.vue'
import PromptInput from '@/components/PromptInput.vue'
import ScoreGauge from '@/components/ScoreGauge.vue'
import RiskReport from '@/components/RiskReport.vue'
import StructuredResume from '@/components/StructuredResume.vue'
import InterviewQuestions from '@/components/InterviewQuestions.vue'

const router = useRouter()
const store = useResumeStore()
const selectedFile = ref<File | null>(null)
const isDev = import.meta.env.DEV
const isUpload = () => store.step === 'upload'
const isLoading = () => store.step === 'loading'
const isResult = () => store.step === 'result'
const isOnline = () => store.healthStatus?.status === 'ok'

onMounted(() => {
  store.init()
})

function handleFileSelect(file: File | null) {
  selectedFile.value = file
}

function handleUpload() {
  if (selectedFile.value) {
    store.upload(selectedFile.value)
  }
}

function handleReset() {
  selectedFile.value = null
  store.reset()
}

function toggleMock() {
  store.useMock = !store.useMock
}
</script>

<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 2L2 8V15C2 21 7 25.5 14 26.5C21 25.5 26 21 26 15V8L14 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M8.5 14.5L11.5 17.5L19.5 10.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <span class="app-name">ResumeAI</span>
        <span class="app-subtitle">智能简历分析平台</span>
        <label v-if="isDev" class="mock-toggle" title="切换 Mock / 真实接口">
          <span class="toggle-label">Mock</span>
          <input type="checkbox" :checked="store.useMock" @change="toggleMock" />
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
        </label>
      </div>
      <div class="header-right">
        <router-link to="/library" class="header-link nav-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 3H7.5C7.77614 3 8 3.22386 8 3.5V7.5C8 7.77614 7.77614 8 7.5 8H2V3Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M14 3H8.5C8.22386 3 8 3.22386 8 3.5V7.5C8 7.77614 8.22386 8 8.5 8H14V3Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M2 9H7.5C7.77614 9 8 9.22386 8 9.5V13.5C8 13.7761 7.77614 14 7.5 14H2V9Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M14 9H8.5C8.22386 9 8 9.22386 8 9.5V13.5C8 13.7761 8.22386 14 8.5 14H14V9Z"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          人才库
        </router-link>
        <div
          class="status-dot"
          :class="{ active: isOnline(), error: store.healthStatus && !isOnline() }"
        ></div>
        <span class="status-text">
          {{ isOnline() ? '服务运行中' : store.healthStatus ? '服务异常' : '检测中...' }}
        </span>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content" :class="`step-${store.step}`">
      <!-- 上传阶段 -->
      <div class="upload-stage" v-if="isUpload()">
        <div class="stage-card upload-card">
          <h1 class="stage-title">简历智能分析</h1>
          <p class="stage-desc">上传简历文档，AI 将自动解析并评估简历质量，识别潜在风险点</p>
          <UploadZone @select="handleFileSelect" />
          <PromptInput />
          <button class="btn-analyze" :disabled="!selectedFile" @click="handleUpload">
            开始解析
          </button>
        </div>
      </div>

      <!-- 加载阶段 -->
      <div class="loading-stage" v-if="isLoading()">
        <div class="stage-card loading-card">
          <div class="loading-spinner">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" class="spinner">
              <circle cx="30" cy="30" r="26" stroke="var(--color-border)" stroke-width="4" />
              <path
                d="M30 4A26 26 0 0 1 56 30"
                stroke="var(--color-accent)"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h2 class="loading-title">正在解析简历...</h2>
          <p class="loading-desc">AI 正在提取简历信息并执行风险分析</p>
          <div class="loading-steps">
            <div class="step-item done">
              <span class="step-dot"></span>
              <span>文档解析</span>
            </div>
            <div class="step-item active">
              <span class="step-dot"></span>
              <span>结构化提取</span>
            </div>
            <div class="step-item">
              <span class="step-dot"></span>
              <span>风险分析</span>
            </div>
            <div class="step-item">
              <span class="step-dot"></span>
              <span>生成报告</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果阶段 -->
      <div class="result-stage" v-if="isResult()">
        <div class="result-toolbar">
          <button class="btn-back" @click="handleReset">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M15 9H3M3 9L7 5M3 9L7 13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            重新上传
          </button>
          <span class="result-filename" v-if="store.uploadResult">
            {{ store.uploadResult.file_name }}
          </span>
          <div class="toolbar-actions">
            <button
              class="btn-action"
              :disabled="store.downloadingReport"
              @click="store.handleDownloadReport()"
              title="下载报告"
            >
              <svg
                v-if="!store.downloadingReport"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 2V10M8 10L5 7M8 10L11 7"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                class="spinner-icon"
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" opacity="0.25" />
                <path
                  d="M8 2A6 6 0 0 1 14 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              {{ store.downloadingReport ? '生成中...' : '下载报告' }}
            </button>
            <button
              class="btn-action"
              :disabled="store.importingToLibrary"
              @click="store.handleImportToLibrary()"
              title="保存到人才库"
            >
              <svg
                v-if="!store.importingToLibrary"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="1.5"
                  y="2"
                  width="13"
                  height="12"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.2"
                />
                <path
                  d="M5 6.5L8 9.5L11 6.5"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M8 4V9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                class="spinner-icon"
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" opacity="0.25" />
                <path
                  d="M8 2A6 6 0 0 1 14 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              {{ store.importingToLibrary ? '保存中...' : '保存到人才库' }}
            </button>
          </div>
        </div>

        <div class="result-grid">
          <!-- 左侧：评分 + 风险报告 -->
          <div class="result-left">
            <div class="stage-card">
              <h2 class="card-title">风险评分</h2>
              <ScoreGauge
                v-if="store.riskReport"
                :score="store.riskReport.risk_score"
                :level="store.riskReport.risk_level"
              />
            </div>
            <div class="stage-card">
              <RiskReport :report="store.riskReport" />
            </div>
            <div class="stage-card">
              <InterviewQuestions
                :data="store.interviewQuestions"
                :loading="store.loadingQuestions"
                @fetch="store.fetchInterviewQuestions()"
              />
            </div>
          </div>

          <!-- 右侧：结构化简历 -->
          <div class="result-right">
            <div class="stage-card">
              <StructuredResume :resume="store.normalizedResume" />
            </div>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div class="error-toast" v-if="store.error">
        {{ store.error }}
        <button class="error-close" @click="store.error = null">&times;</button>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="app-footer">
      <span>ResumeAI v0.1.0</span>
      <span class="footer-divider">|</span>
      <span>Powered by MG</span>
    </footer>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  color: var(--color-accent);
  display: flex;
}

.app-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.app-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  padding: 2px 8px;
  background: var(--color-surface);
  border-radius: 4px;
}

.mock-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  margin-left: 4px;
}

.mock-toggle input {
  display: none;
}

.toggle-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
}

.toggle-track {
  position: relative;
  width: 32px;
  height: 18px;
  background: var(--color-border);
  border-radius: 9px;
  transition: background 0.25s;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.25s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.mock-toggle input:checked + .toggle-track {
  background: var(--color-accent);
}

.mock-toggle input:checked + .toggle-track .toggle-thumb {
  transform: translateX(14px);
  box-shadow: 0 1px 4px rgba(0, 136, 204, 0.35);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-muted);
}

.status-dot.active {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.status-dot.error {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

/* Stage Cards */
.stage-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 28px;
}

/* Upload Stage */
.upload-stage {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stage-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-align: center;
  letter-spacing: -1px;
}

.stage-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
  text-align: center;
  line-height: 1.6;
}

/* Loading Stage */
.loading-stage {
  width: 100%;
  max-width: 480px;
}

.loading-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.loading-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.loading-steps {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border);
}

.step-item.done .step-dot {
  background: #22c55e;
}

.step-item.active .step-dot {
  background: var(--color-accent);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Result Stage */
.result-stage {
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
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

.toolbar-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-icon {
  animation: spin 0.8s linear infinite;
}

.header-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 12px;
}

.header-link.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
  transition: all 0.25s;
  box-shadow: 0 2px 8px rgba(99, 91, 255, 0.2);
}

.header-link.nav-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(99, 91, 255, 0.35);
  color: #fff;
}

.header-link:hover {
  color: var(--color-accent);
}

.result-filename {
  font-size: 13px;
  color: var(--color-text-muted);
}

.result-grid {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 20px;
  align-items: start;
}

.result-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 88px;
}

.result-right {
  min-height: 400px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 20px;
  text-align: center;
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(229, 62, 62, 0.08);
  border: 1px solid rgba(229, 62, 62, 0.25);
  color: #c53030;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(8px);
}

.error-close {
  background: none;
  border: none;
  color: #c53030;
  cursor: pointer;
  font-size: 18px;
}

/* Footer */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  font-size: 11px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.footer-divider {
  color: var(--color-border);
}

/* Analyze Button */
.btn-analyze {
  padding: 14px 32px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.5px;
}

.btn-analyze:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 136, 204, 0.25);
}

.btn-analyze:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 900px) {
  .result-grid {
    grid-template-columns: 1fr;
  }

  .result-left {
    position: static;
  }
}
</style>
