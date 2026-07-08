import { defineStore } from 'pinia'
import { ref } from 'vue'
import { uploadResume, getNormalizedResume, getRiskReport } from '@/api/resume'
import { mockUpload, mockNormalizedResume, mockRiskReport } from '@/api/mock'
import type { UploadResponse, ResumeSchema, RiskReport } from '@/types/resume'

export const useResumeStore = defineStore('resume', () => {
  // ---- mock 开关 ----
  // 联调后改为 false 即可切换到真实接口
  const useMock = ref(true)

  const uploading = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadResult = ref<UploadResponse | null>(null)
  const normalizedResume = ref<ResumeSchema | null>(null)
  const riskReport = ref<RiskReport | null>(null)
  const promptText = ref('')

  const step = ref<'upload' | 'loading' | 'result'>('upload')

  async function upload(file: File, forceOcr = false) {
    uploading.value = true
    error.value = null
    step.value = 'loading'
    try {
      const result = useMock.value
        ? await mockUpload(file, forceOcr)
        : await uploadResume(file, forceOcr)
      uploadResult.value = result
      await fetchResults(result.resume_id)
      step.value = 'result'
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '上传失败'
      step.value = 'upload'
    } finally {
      uploading.value = false
    }
  }

  async function fetchResults(resumeId: string) {
    loading.value = true
    try {
      const [resume, report] = useMock.value
        ? await Promise.all([mockNormalizedResume(resumeId), mockRiskReport(resumeId)])
        : await Promise.all([getNormalizedResume(resumeId), getRiskReport(resumeId)])
      normalizedResume.value = resume
      riskReport.value = report
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '获取结果失败'
    } finally {
      loading.value = false
    }
  }

  function reset() {
    uploadResult.value = null
    normalizedResume.value = null
    riskReport.value = null
    error.value = null
    step.value = 'upload'
    uploading.value = false
  }

  return {
    useMock,
    uploading,
    loading,
    error,
    uploadResult,
    normalizedResume,
    riskReport,
    promptText,
    step,
    upload,
    reset,
  }
})
