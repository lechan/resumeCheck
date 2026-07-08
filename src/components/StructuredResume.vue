<script setup lang="ts">
import type { ResumeSchema, Field, EducationField } from '@/types/resume'

defineProps<{
  resume: ResumeSchema | null
}>()

function fv(field: Field | Field<number> | EducationField | undefined | null): string {
  if (!field || field.value === null || field.value === undefined) return ''
  return String(field.value)
}

function fvList(fields: Field[]): string[] {
  return fields.map((f) => String(f.value ?? '')).filter(Boolean)
}
</script>

<template>
  <div class="structured-resume" v-if="resume">
    <!-- 候选人信息 -->
    <section class="resume-section">
      <h4 class="section-label">基本信息</h4>
      <div class="info-grid">
        <div class="info-item" v-if="fv(resume.candidate.name)">
          <span class="info-key">姓名</span>
          <span class="info-val highlight">{{ fv(resume.candidate.name) }}</span>
        </div>
        <div class="info-item" v-if="fv(resume.candidate.current_city)">
          <span class="info-key">城市</span>
          <span class="info-val">{{ fv(resume.candidate.current_city) }}</span>
        </div>
        <div class="info-item" v-if="fv(resume.candidate.email)">
          <span class="info-key">邮箱</span>
          <span class="info-val">{{ fv(resume.candidate.email) }}</span>
        </div>
        <div class="info-item" v-if="fv(resume.candidate.phone)">
          <span class="info-key">电话</span>
          <span class="info-val">{{ fv(resume.candidate.phone) }}</span>
        </div>
        <div class="info-item" v-if="fv(resume.candidate.highest_degree)">
          <span class="info-key">最高学历</span>
          <span class="info-val">{{ fv(resume.candidate.highest_degree) }}</span>
        </div>
        <div
          class="info-item"
          v-if="
            resume.candidate.total_work_years?.value !== null &&
            resume.candidate.total_work_years?.value !== undefined
          "
        >
          <span class="info-key">工作年限</span>
          <span class="info-val">{{ resume.candidate.total_work_years.value }} 年</span>
        </div>
      </div>
    </section>

    <!-- 自我评价 -->
    <section class="resume-section" v-if="resume.self_evaluation.text">
      <h4 class="section-label">自我评价</h4>
      <p class="evaluation-text">{{ resume.self_evaluation.text }}</p>
    </section>

    <!-- 技能 -->
    <section class="resume-section" v-if="fvList(resume.skills).length">
      <h4 class="section-label">技能标签</h4>
      <div class="skill-tags">
        <span v-for="(skill, idx) in fvList(resume.skills)" :key="idx" class="skill-tag">{{
          skill
        }}</span>
      </div>
    </section>

    <!-- 证书 -->
    <section class="resume-section" v-if="fvList(resume.certificates).length">
      <h4 class="section-label">证书</h4>
      <div class="skill-tags">
        <span
          v-for="(cert, idx) in fvList(resume.certificates)"
          :key="idx"
          class="skill-tag cert"
          >{{ cert }}</span
        >
      </div>
    </section>

    <!-- 语言 -->
    <section class="resume-section" v-if="fvList(resume.languages).length">
      <h4 class="section-label">语言能力</h4>
      <div class="skill-tags">
        <span v-for="(lang, idx) in fvList(resume.languages)" :key="idx" class="skill-tag lang">{{
          lang
        }}</span>
      </div>
    </section>

    <!-- 工作经历 -->
    <section class="resume-section" v-if="resume.work_experience.length">
      <h4 class="section-label">工作经历</h4>
      <div class="timeline">
        <div v-for="(work, idx) in resume.work_experience" :key="idx" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="company-name">{{
                fv(work.company_name) || fv(work.title) || '--'
              }}</span>
              <span class="timeline-date" v-if="fv(work.start_date) || fv(work.end_date)">
                {{ fv(work.start_date) || '--' }} —
                {{ work.is_current ? '至今' : fv(work.end_date) || '至今' }}
              </span>
            </div>
            <p class="position-name" v-if="fv(work.company_name) && fv(work.title)">
              {{ fv(work.title) }}
            </p>
            <p class="work-desc" v-if="fv(work.description)">{{ fv(work.description) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 教育经历 -->
    <section class="resume-section" v-if="resume.education.length">
      <h4 class="section-label">教育经历</h4>
      <div class="timeline">
        <div v-for="(edu, idx) in resume.education" :key="idx" class="timeline-item">
          <div class="timeline-dot secondary"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="company-name">{{ fv(edu.school_name) || '--' }}</span>
              <span class="timeline-date" v-if="fv(edu.start_date) || fv(edu.end_date)">
                {{ fv(edu.start_date) || '--' }} —
                {{ edu.is_current ? '至今' : fv(edu.end_date) || '--' }}
              </span>
            </div>
            <p class="position-name" v-if="fv(edu.major) || fv(edu.degree)">
              {{ [fv(edu.degree), fv(edu.major)].filter(Boolean).join(' · ') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目经历 -->
    <section class="resume-section" v-if="resume.project_experience.length">
      <h4 class="section-label">项目经历</h4>
      <div class="timeline">
        <div v-for="(proj, idx) in resume.project_experience" :key="idx" class="timeline-item">
          <div class="timeline-dot accent2"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="company-name">{{ fv(proj.project_name) || '--' }}</span>
              <span class="timeline-date" v-if="fv(proj.start_date) || fv(proj.end_date)">
                {{ fv(proj.start_date) || '--' }} — {{ fv(proj.end_date) || '至今' }}
              </span>
            </div>
            <p class="position-name" v-if="fv(proj.role)">{{ fv(proj.role) }}</p>
            <p class="work-desc" v-if="fv(proj.description)">{{ fv(proj.description) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 空状态 -->
    <div
      class="empty-state"
      v-if="
        !fv(resume.candidate.name) &&
        !resume.self_evaluation.text &&
        !fvList(resume.skills).length &&
        !resume.work_experience.length &&
        !resume.education.length
      "
    >
      <p>未提取到结构化简历信息</p>
      <p class="empty-hint" v-if="resume.parse_meta.raw_text">
        简历内容已识别，但可能不是标准简历格式
      </p>
    </div>
  </div>
</template>

<style scoped>
.structured-resume {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resume-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-accent);
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  background: var(--color-surface);
  border-radius: 8px;
}

.info-key {
  font-size: 11px;
  color: var(--color-text-muted);
}

.info-val {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

.info-val.highlight {
  color: var(--color-accent);
  font-weight: 700;
  font-size: 16px;
}

.evaluation-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
  padding: 12px;
  background: var(--color-surface);
  border-radius: 8px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 6px;
  background: rgba(0, 136, 204, 0.07);
  border: 1px solid rgba(0, 136, 204, 0.18);
  color: var(--color-accent);
}

.skill-tag.cert {
  background: rgba(99, 91, 255, 0.07);
  border-color: rgba(99, 91, 255, 0.18);
  color: var(--color-accent-secondary);
}

.skill-tag.lang {
  background: rgba(34, 197, 94, 0.07);
  border-color: rgba(34, 197, 94, 0.18);
  color: #16a34a;
}

.timeline {
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 4px;
  bottom: 4px;
  width: 1px;
  background: var(--color-border);
}

.timeline-item {
  position: relative;
  padding-bottom: 16px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -15px;
  top: 6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
}

.timeline-dot.secondary {
  background: var(--color-accent-secondary);
}

.timeline-dot.accent2 {
  background: #22c55e;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.company-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.timeline-date {
  font-size: 11px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.position-name {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.work-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 4px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 4px 0;
  font-size: 14px;
}

.empty-hint {
  font-size: 12px !important;
  color: var(--color-text-muted);
}
</style>
