import { defineStore } from 'pinia'
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  uploadResume,
  getNormalizedResume,
  getRiskReport,
  getRootInfo,
  getHealth,
  importToLibrary,
  recommendInterviewQuestions,
} from '@/api/resume'
import {
  mockUpload,
  mockNormalizedResume,
  mockRiskReport,
  mockRootInfo,
  mockHealth,
  mockImportToLibrary,
  mockRecommendInterviewQuestions,
} from '@/api/mock'
import type {
  UploadResponse,
  ResumeSchema,
  RiskReport,
  RootInfo,
  HealthStatus,
  LibraryDetail,
  InterviewQuestionResponse,
} from '@/types/resume'

export const useResumeStore = defineStore('resume', () => {
  // ---- mock 开关 ----
  // 联调后改为 false 即可切换到真实接口
  const useMock = ref(false)

  const uploading = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadResult = ref<UploadResponse | null>(null)
  const normalizedResume = ref<ResumeSchema | null>(null)
  const riskReport = ref<RiskReport | null>(null)
  const promptText = ref('')
  const rootInfo = ref<RootInfo | null>(null)
  const healthStatus = ref<HealthStatus | null>(null)
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null

  const interviewQuestions = ref<InterviewQuestionResponse | null>(null)
  const loadingQuestions = ref(false)
  const downloadingReport = ref(false)
  const importingToLibrary = ref(false)

  const step = ref<'upload' | 'loading' | 'result'>('upload')

  async function init() {
    await checkHealth()
    startHeartbeat()
  }

  async function checkHealth() {
    try {
      healthStatus.value = useMock.value ? await mockHealth() : await getHealth()
    } catch {
      healthStatus.value = { status: 'error', services: {}, time: '' }
    }
  }

  function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(checkHealth, 30000) // 30 秒心跳
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  async function upload(file: File) {
    uploading.value = true
    error.value = null
    step.value = 'loading'
    try {
      const result = useMock.value
        ? await mockUpload(file)
        : await uploadResume(file, {}, promptText.value)
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

  async function handleDownloadReport() {
    if (!uploadResult.value || downloadingReport.value) return
    const el = document.querySelector('.result-stage') as HTMLElement | null
    if (!el) {
      error.value = '未找到报告内容'
      return
    }
    downloadingReport.value = true
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const blobUrl = pdf.output('bloburl')
      window.open(blobUrl, '_blank')
    } catch {
      error.value = '下载报告失败'
    } finally {
      downloadingReport.value = false
    }
  }

  async function handleImportToLibrary(): Promise<LibraryDetail | null> {
    if (!uploadResult.value || importingToLibrary.value) return null
    importingToLibrary.value = true
    try {
      return useMock.value
        ? await mockImportToLibrary()
        : await importToLibrary({ resume_id: uploadResult.value.resume_id })
    } catch {
      error.value = '保存到简历库失败'
      return null
    } finally {
      importingToLibrary.value = false
    }
  }

  async function fetchInterviewQuestions() {
    if (!uploadResult.value) return
    loadingQuestions.value = true
    try {
      interviewQuestions.value = useMock.value
        ? await mockRecommendInterviewQuestions()
        : await recommendInterviewQuestions({ resume_id: uploadResult.value.resume_id })
    } catch {
      error.value = '获取面试题失败'
    } finally {
      loadingQuestions.value = false
    }
  }

  function reset() {
    uploadResult.value = null
    normalizedResume.value = null
    riskReport.value = null
    interviewQuestions.value = null
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
    rootInfo,
    healthStatus,
    interviewQuestions,
    loadingQuestions,
    downloadingReport,
    importingToLibrary,
    step,
    init,
    upload,
    handleDownloadReport,
    handleImportToLibrary,
    fetchInterviewQuestions,
    reset,
  }
})
