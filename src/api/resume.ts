import api from './index'
import type { UploadResponse, ResumeSchema, RiskReport, ParseResult } from '@/types/resume'

// 上传简历
export async function uploadResume(file: File, forceOcr = false): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('options', JSON.stringify({ force_ocr: forceOcr }))

  const { data } = await api.post<UploadResponse>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// 获取结构化简历
export async function getNormalizedResume(resumeId: string): Promise<ResumeSchema> {
  const { data } = await api.get<ResumeSchema>(`/resumes/${resumeId}/normalized`)
  return data
}

// 获取风险报告
export async function getRiskReport(resumeId: string): Promise<RiskReport> {
  const { data } = await api.get<RiskReport>(`/resumes/${resumeId}/risk-report`)
  return data
}

// 获取原始解析结果
export async function getParseResult(resumeId: string): Promise<ParseResult> {
  const { data } = await api.get<ParseResult>(`/resumes/${resumeId}/parse-result`)
  return data
}

// 重新分析
export async function reanalyzeResume(resumeId: string): Promise<{ status: string }> {
  const { data } = await api.post(`/resumes/${resumeId}/reanalyze`)
  return data
}

// 查询任务状态
export async function getResumeStatus(resumeId: string): Promise<{
  resume_id: string
  task_id: string
  status: string
  progress: number
  current_stage: string
}> {
  const { data } = await api.get(`/resumes/${resumeId}/status`)
  return data
}
