<script setup lang="ts">
import { ref } from 'vue'
import {
  matchJob,
  queryLibrary,
  importToLibrary,
  getLibraryDetail,
  deleteLibrary,
} from '@/api/resume'
import {
  mockMatchJob,
  mockQueryLibrary,
  mockImportToLibrary,
  mockGetLibraryDetail,
  mockDeleteLibrary,
} from '@/api/mock'
import type { JobMatchResponse, LibraryListItem, LibraryDetail } from '@/types/resume'
import StructuredResume from '@/components/StructuredResume.vue'
import RiskReport from '@/components/RiskReport.vue'

const useMock = ref(false)

function riskLevelLabel(level: string) {
  const map: Record<string, string> = {
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    critical: '严重风险',
  }
  return map[level] || level
}

const jd = ref('')
const requiredSkills = ref('')
const minYears = ref<number | undefined>()
const matching = ref(false)
const matchResult = ref<JobMatchResponse | null>(null)

const library = ref<LibraryListItem[]>([])
const loadingLibrary = ref(false)
const deletingId = ref<string | null>(null)

// 抽屉
const drawerOpen = ref(false)
const drawerDetail = ref<LibraryDetail | null>(null)
const loadingDetail = ref(false)

async function handleMatch() {
  matching.value = true
  try {
    const skills = requiredSkills.value
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean)
    matchResult.value = useMock.value
      ? await mockMatchJob()
      : await matchJob({
          job_description: jd.value || undefined,
          required_skills: skills.length ? skills : undefined,
          min_years: minYears.value,
        })
  } catch {
    // error
  } finally {
    matching.value = false
  }
}

async function handleImport(resumeId: string) {
  try {
    useMock.value ? await mockImportToLibrary() : await importToLibrary({ resume_id: resumeId })
    await loadLibrary()
  } catch {
    // error
  }
}

async function openDetail(libraryId: string) {
  drawerOpen.value = true
  loadingDetail.value = true
  try {
    drawerDetail.value = useMock.value
      ? await mockGetLibraryDetail(libraryId)
      : await getLibraryDetail(libraryId)
  } catch {
    // error
  } finally {
    loadingDetail.value = false
  }
}

function closeDrawer() {
  drawerOpen.value = false
  drawerDetail.value = null
}

async function loadLibrary() {
  loadingLibrary.value = true
  try {
    library.value = useMock.value ? await mockQueryLibrary() : await queryLibrary()
  } catch {
    // error
  } finally {
    loadingLibrary.value = false
  }
}

async function handleSaveAndRefresh(resumeId: string) {
  await handleImport(resumeId)
  await loadLibrary()
}

async function handleDelete(libraryId: string) {
  if (deletingId.value) return
  deletingId.value = libraryId
  try {
    await (useMock.value ? mockDeleteLibrary(libraryId) : deleteLibrary(libraryId))
    library.value = library.value.filter((item) => item.library_id !== libraryId)
  } catch {
    // error
  } finally {
    deletingId.value = null
  }
}

loadLibrary()
</script>

<template>
  <div class="talent-panel">
    <!-- ---- JD 匹配 ---- -->
    <div class="section">
      <h2 class="section-title">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="9" cy="9" r="5" stroke="currentColor" stroke-width="1.5" />
          <path
            d="M12.5 12.5L19 19"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.2" />
          <rect
            x="15"
            y="15"
            width="6"
            height="6"
            rx="1"
            stroke="currentColor"
            stroke-width="1.2"
          />
        </svg>
        JD 匹配
      </h2>

      <div class="match-form">
        <textarea
          v-model="jd"
          class="match-input"
          rows="3"
          placeholder="粘贴职位描述（JD）..."
        ></textarea>
        <div class="match-options">
          <input
            v-model="requiredSkills"
            class="match-input small"
            placeholder="必备技能（逗号分隔）"
          />
          <input
            v-model.number="minYears"
            class="match-input tiny"
            type="number"
            placeholder="最低年限"
            min="0"
          />
          <button class="btn-match" @click="handleMatch" :disabled="matching || !jd.trim()">
            {{ matching ? '匹配中...' : '开始匹配' }}
          </button>
        </div>
      </div>

      <!-- 匹配结果 -->
      <div class="match-results" v-if="matchResult">
        <div class="match-summary">
          从 {{ matchResult.total_candidates_scanned }} 位候选人中匹配到
          <strong>{{ matchResult.matched_count }}</strong> 位
        </div>
        <div class="match-items">
          <div v-for="item in matchResult.items" :key="item.library_id" class="match-card">
            <div class="match-card-header">
              <span class="match-name">{{ item.candidate_name }}</span>
              <span class="match-score">{{ Math.round(item.match_score) }}<small>分</small></span>
            </div>
            <p class="match-title">{{ item.current_title }}</p>
            <div class="match-meta">
              <span class="meta-item" :class="'risk-' + item.risk_level">
                风险指数 {{ item.risk_score }}/100
              </span>
            </div>
            <div class="match-tags">
              <span v-for="s in item.matched_skills" :key="s" class="tag green">{{ s }}</span>
              <span v-for="s in item.missing_skills" :key="s" class="tag red">{{ s }}</span>
              <span
                v-if="!item.matched_skills.length && !item.missing_skills.length"
                class="tag empty"
                >无技能要求数据</span
              >
            </div>
            <div class="match-reasons" v-if="item.reasons.length">
              <p v-for="r in item.reasons" :key="r" class="reason">{{ r }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ---- 简历库 ---- -->
    <div class="section">
      <h2 class="section-title">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect
            x="2"
            y="3"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M7 8H15M7 12H13"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
        简历库
      </h2>

      <div class="library-grid" v-if="library.length">
        <div
          v-for="item in library"
          :key="item.library_id"
          class="lib-card"
          @click="openDetail(item.library_id)"
        >
          <button
            class="lib-delete"
            :disabled="deletingId === item.library_id"
            @click.stop="handleDelete(item.library_id)"
            title="删除"
          >
            <svg
              v-if="deletingId !== item.library_id"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M2 4H12M5 4V3C5 2.44772 5.44772 2 6 2H8C8.55228 2 9 2.44772 9 3V4M11 4V11C11 11.5523 10.5523 12 10 12H4C3.44772 12 3 11.5523 3 11V4H11Z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              class="spinner-icon-sm"
            >
              <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" opacity="0.25" />
              <path
                d="M7 2A5 5 0 0 1 12 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <div class="lib-card-header">
            <span class="lib-name">{{ item.candidate_name }}</span>
            <span class="lib-risk" :class="'risk-' + item.risk_level">{{
              riskLevelLabel(item.risk_level)
            }}</span>
          </div>
          <p class="lib-title">{{ item.current_title }}</p>
          <div class="lib-meta" v-if="item.current_city || item.total_work_years">
            <span v-if="item.current_city">{{ item.current_city }}</span>
            <span v-if="item.total_work_years">{{ item.total_work_years }} 年</span>
            <span v-if="item.highest_degree">{{ item.highest_degree }}</span>
          </div>
          <div class="lib-tags" v-if="item.skills.length">
            <span v-for="s in item.skills.slice(0, 5)" :key="s" class="lib-tag">{{ s }}</span>
          </div>
          <div class="lib-score">风险指数: {{ item.risk_score }}</div>
        </div>
      </div>
      <div class="empty-state" v-else-if="!loadingLibrary">
        <p>简历库为空，解析完成后可将简历保存到库中</p>
      </div>
    </div>

    <!-- ---- 详情抽屉 ---- -->
    <Teleport to="body">
      <div class="drawer-overlay" :class="{ open: drawerOpen }" @click.self="closeDrawer">
        <div class="drawer-panel" :class="{ open: drawerOpen }">
          <div class="drawer-header">
            <h3 class="drawer-title">
              {{ drawerDetail?.candidate_name || '简历详情' }}
            </h3>
            <button class="drawer-close" @click="closeDrawer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M5 5L13 13M13 5L5 13"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
          <div class="drawer-body">
            <div class="loading-spot" v-if="loadingDetail">
              <div class="spinner-small"></div>
              <span>加载中...</span>
            </div>
            <template v-else-if="drawerDetail">
              <div class="drawer-section" v-if="drawerDetail.resume">
                <div class="drawer-source">
                  <span class="source-tag" v-if="drawerDetail.resume.source.file_type">
                    {{ drawerDetail.resume.source.file_type.toUpperCase() }}
                  </span>
                  <span class="source-filename">{{ drawerDetail.resume.source.file_name }}</span>
                  <span class="source-meta" v-if="drawerDetail.resume.source.pages">
                    {{ drawerDetail.resume.source.pages }} 页
                  </span>
                  <span class="source-meta" v-if="drawerDetail.resume.parse_meta.parse_confidence">
                    置信度 {{ (drawerDetail.resume.parse_meta.parse_confidence * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
              <div class="drawer-section" v-if="drawerDetail.risk_report">
                <h4 class="drawer-section-title">风险评分</h4>
                <div class="drawer-risk">
                  <span class="risk-big">{{ drawerDetail.risk_score }}/100</span>
                  <span class="risk-lvl" :class="'risk-' + drawerDetail.risk_level">{{
                    riskLevelLabel(drawerDetail.risk_level)
                  }}</span>
                </div>
              </div>
              <div class="drawer-section" v-if="drawerDetail.risk_report">
                <RiskReport :report="drawerDetail.risk_report" />
              </div>
              <div class="drawer-section" v-if="drawerDetail.resume">
                <StructuredResume :resume="drawerDetail.resume" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.talent-panel {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

/* ---- JD Match ---- */
.match-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.match-input {
  width: 100%;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 13px;
  line-height: 1.6;
  padding: 10px 12px;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
}

.match-input:focus {
  border-color: var(--color-accent);
}

.match-input.small {
  min-height: 36px;
  height: 36px;
  resize: none;
}
.match-input.tiny {
  min-height: 36px;
  height: 36px;
  width: 100px;
  resize: none;
}

.match-options {
  display: flex;
  gap: 8px;
  align-items: center;
}

.match-options .match-input.small {
  flex: 1;
}

.btn-match {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary));
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-match:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.match-summary {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.match-summary strong {
  color: var(--color-accent);
}

.match-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.match-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}

.match-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 16px rgba(0, 136, 204, 0.12);
  transform: translateY(-2px);
}

.match-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}
.match-score {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-accent);
}
.match-score small {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
}
.match-title {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.match-meta {
  display: flex;
  gap: 8px;
}

.meta-item {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--color-surface);
}

.meta-item.risk-low {
  color: #16a34a;
}
.meta-item.risk-medium {
  color: #b45309;
}
.meta-item.risk-high {
  color: #c2410c;
}
.meta-item.risk-critical {
  color: #dc2626;
}

.match-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tag.green {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}
.tag.red {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.tag.empty {
  background: rgba(107, 114, 128, 0.08);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

.reason {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

/* ---- Library ---- */
.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.lib-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
  position: relative;
}

.lib-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 16px rgba(0, 136, 204, 0.12);
  transform: translateY(-2px);
}

.lib-card:hover::after {
  opacity: 1;
}

.lib-card::after {
  content: '→';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}

.lib-delete {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  z-index: 1;
}

.lib-card:hover .lib-delete {
  opacity: 1;
}

.lib-delete:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.lib-delete:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner-icon-sm {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lib-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lib-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.lib-risk {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 4px;
}

.lib-risk.risk-low {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}
.lib-risk.risk-medium {
  background: rgba(234, 179, 8, 0.1);
  color: #b45309;
}
.lib-risk.risk-high {
  background: rgba(249, 115, 22, 0.1);
  color: #c2410c;
}
.lib-risk.risk-critical {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.lib-title {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}
.lib-meta {
  font-size: 11px;
  color: var(--color-text-muted);
  display: flex;
  gap: 8px;
}
.lib-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.lib-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  background: rgba(0, 136, 204, 0.07);
  color: var(--color-accent);
}

.lib-score {
  font-size: 11px;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-muted);
  font-size: 13px;
}

/* ---- Drawer ---- */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.drawer-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 580px;
  max-width: 90vw;
  height: 100vh;
  background: var(--color-bg);
  border-left: 1px solid var(--color-border);
  z-index: 201;
  transform: translateX(100%);
  transition: transform 0.35s ease;
  display: flex;
  flex-direction: column;
}

.drawer-panel.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.drawer-close {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.drawer-close:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.drawer-section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 10px;
}

.drawer-source {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 14px;
  background: var(--color-surface);
  border-radius: 8px;
}

.source-tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(0, 136, 204, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.source-filename {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-all;
}

.source-meta {
  font-size: 11px;
  color: var(--color-text-muted);
}

.drawer-risk {
  display: flex;
  align-items: center;
  gap: 12px;
}

.risk-big {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}

.risk-lvl {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.risk-lvl.risk-low {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}
.risk-lvl.risk-medium {
  background: rgba(234, 179, 8, 0.1);
  color: #b45309;
}
.risk-lvl.risk-high {
  background: rgba(249, 115, 22, 0.1);
  color: #c2410c;
}
.risk-lvl.risk-critical {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
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

.loading-spot {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 32px 0;
  justify-content: center;
}
</style>
