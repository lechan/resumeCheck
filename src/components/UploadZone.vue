<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  select: [file: File | null]
}>()

const dragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)

function onDragOver(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}
function onDragLeave() {
  dragging.value = false
}
function onDrop(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) selectFile(file)
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) selectFile(file)
}

function selectFile(file: File) {
  selectedFile.value = file
  emit('select', file)
}

function triggerUpload() {
  fileInput.value?.click()
}

function clearFile() {
  selectedFile.value = null
  emit('select', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div
    class="upload-zone"
    :class="{ dragging, 'has-file': selectedFile }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="!selectedFile && triggerUpload()"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
      class="file-input-hidden"
      @change="onFileChange"
    />

    <template v-if="!selectedFile">
      <div class="upload-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M24 32V16M24 16L18 22M24 16L30 22"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 32V38C8 39.1046 8.89543 40 10 40H38C39.1046 40 40 39.1046 40 38V32"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M13 18C10.7909 18 9 19.7909 9 22C9 24.2091 10.7909 26 13 26C13.665 26 14.297 25.855 14.869 25.592C14.964 25.727 15.062 25.86 15.165 25.99C17.017 28.345 19.886 30 23.14 30C25.199 30 27.081 29.227 28.56 27.928C30.02 29.147 31.912 29.885 33.98 29.885C37.654 29.885 40.5 26.92 40.5 23.3C40.5 20.893 39.12 18.814 37.116 17.818C37.361 17.086 37.5 16.308 37.5 15.5C37.5 11.3579 34.1421 8 30 8C27.1411 8 24.673 9.65179 23.446 12.0358C22.352 10.1434 20.325 8.88533 18 8.88533C14.474 8.88533 11.5 11.7467 11.5 15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <p class="upload-title">拖拽简历文件到此处</p>
      <p class="upload-hint">支持 PDF / DOCX / DOC / JPG / PNG 格式</p>
    </template>

    <template v-else>
      <div class="file-preview">
        <div class="file-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect
              x="8"
              y="4"
              width="24"
              height="32"
              rx="3"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M14 14H26M14 20H26M14 26H20"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="file-info">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
        </div>
        <button class="btn-remove" @click.stop.prevent="clearFile" title="移除文件" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.upload-zone {
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--color-surface);
  position: relative;
  overflow: hidden;
}

.upload-zone::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.upload-zone:hover::before,
.upload-zone.dragging::before {
  opacity: 0.05;
}

.upload-zone.dragging {
  border-color: var(--color-accent);
  transform: scale(1.01);
}

.upload-zone.has-file {
  border-style: solid;
  border-color: var(--color-accent);
  cursor: default;
  padding: 24px;
}

.file-input-hidden {
  display: none;
}

.upload-icon {
  color: var(--color-text-muted);
  margin-bottom: 16px;
  transition: color 0.3s;
}

.upload-zone:hover .upload-icon,
.upload-zone.dragging .upload-icon {
  color: var(--color-accent);
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px;
}

.upload-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.file-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  min-width: 0;
  text-align: left;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.file-size {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn-remove {
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
  flex-shrink: 0;
}

.btn-remove:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}
</style>
