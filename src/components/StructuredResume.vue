<script setup lang="ts">
import type { ResumeSchema } from '@/types/resume'

defineProps<{
  resume: ResumeSchema | null
}>()
</script>

<template>
  <div class="structured-resume" v-if="resume">
    <!-- 候选人信息 -->
    <section class="resume-section">
      <h4 class="section-label">基本信息</h4>
      <div class="info-grid">
        <div class="info-item" v-if="resume.candidate.name">
          <span class="info-key">姓名</span>
          <span class="info-val highlight">{{ resume.candidate.name }}</span>
        </div>
        <div class="info-item" v-if="resume.candidate.current_position">
          <span class="info-key">当前职位</span>
          <span class="info-val">{{ resume.candidate.current_position }}</span>
        </div>
        <div class="info-item" v-if="resume.candidate.email">
          <span class="info-key">邮箱</span>
          <span class="info-val">{{ resume.candidate.email }}</span>
        </div>
        <div class="info-item" v-if="resume.candidate.phone">
          <span class="info-key">电话</span>
          <span class="info-val">{{ resume.candidate.phone }}</span>
        </div>
        <div class="info-item" v-if="resume.candidate.years_of_experience">
          <span class="info-key">工作年限</span>
          <span class="info-val">{{ resume.candidate.years_of_experience }} 年</span>
        </div>
      </div>
    </section>

    <!-- 技能 -->
    <section class="resume-section" v-if="resume.skills.length">
      <h4 class="section-label">技能标签</h4>
      <div class="skill-tags">
        <span v-for="skill in resume.skills" :key="skill" class="skill-tag">{{ skill }}</span>
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
              <span class="company-name">{{ work.company }}</span>
              <span class="timeline-date" v-if="work.start_date || work.end_date">
                {{ work.start_date }} — {{ work.end_date || '至今' }}
              </span>
            </div>
            <p class="position-name" v-if="work.position">{{ work.position }}</p>
            <p class="work-desc" v-if="work.description">{{ work.description }}</p>
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
              <span class="company-name">{{ edu.school }}</span>
              <span class="timeline-date" v-if="edu.start_date || edu.end_date">
                {{ edu.start_date }} — {{ edu.end_date }}
              </span>
            </div>
            <p class="position-name" v-if="edu.major || edu.degree">
              {{ [edu.degree, edu.major].filter(Boolean).join(' · ') }}
            </p>
          </div>
        </div>
      </div>
    </section>
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
</style>
