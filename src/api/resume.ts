import api from './index'
import type {
  UploadResponse,
  ResumeSchema,
  RiskReport,
  ParseResult,
  RootInfo,
  HealthStatus,
  TaskStatus,
  ReanalyzeRequest,
  ReportDownload,
  ImportLibraryRequest,
  LibraryListItem,
  LibraryDetail,
  LibraryQuery,
  JobMatchRequest,
  JobMatchResponse,
  InterviewQuestionRequest,
  InterviewQuestionResponse,
} from '@/types/resume'

// ===========================
// Root & 健康检查
// ===========================

/** GET / - 获取服务基础信息 */
export async function getRootInfo(): Promise<RootInfo> {
  const { data } = await api.get<RootInfo>('/')
  return data
}

/** GET /api/v1/health - 健康检查 */
export async function getHealth(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health')
  return data
}

// ===========================
// 简历解析
// ===========================

/**
 * POST /api/v1/resumes/upload
 * 上传简历并触发解析
 */
export async function uploadResume(
  file: File,
  options?: { force_ocr?: boolean },
  analysisPrompt?: string,
): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('options', JSON.stringify(options ?? {}))
  if (analysisPrompt) {
    formData.append('analysis_prompt', analysisPrompt)
  }

  const { data } = await api.post<UploadResponse>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/** GET /api/v1/resumes/{resume_id}/status - 查询解析任务状态 */
export async function getResumeStatus(resumeId: string): Promise<TaskStatus> {
  const { data } = await api.get<TaskStatus>(`/resumes/${resumeId}/status`)
  return data
}

/** GET /api/v1/resumes/{resume_id}/normalized - 获取结构化简历 */
export async function getNormalizedResume(resumeId: string): Promise<ResumeSchema> {
  const { data } = await api.get<ResumeSchema>(`/resumes/${resumeId}/normalized`)
  return data
}

/** GET /api/v1/resumes/{resume_id}/parse-result - 获取原始解析结果 */
export async function getParseResult(resumeId: string): Promise<ParseResult> {
  const { data } = await api.get<ParseResult>(`/resumes/${resumeId}/parse-result`)
  return data
}

/** GET /api/v1/resumes/{resume_id}/risk-report - 获取风险报告 */
export async function getRiskReport(resumeId: string): Promise<RiskReport> {
  const { data } = await api.get<RiskReport>(`/resumes/${resumeId}/risk-report`)
  return data
}

/**
 * GET /api/v1/resumes/{resume_id}/risk-report/download
 * 获取风险报告下载地址
 */
export async function getReportDownloadUrl(
  resumeId: string,
  format: 'pdf' | 'html' | 'json' = 'pdf',
): Promise<ReportDownload> {
  const { data } = await api.get<ReportDownload>(
    `/resumes/${resumeId}/risk-report/download`,
    { params: { format } },
  )
  return data
}

/**
 * POST /api/v1/resumes/{resume_id}/reanalyze
 * 重新分析简历
 */
export async function reanalyzeResume(
  resumeId: string,
  body?: ReanalyzeRequest,
): Promise<TaskStatus> {
  const { data } = await api.post<TaskStatus>(
    `/resumes/${resumeId}/reanalyze`,
    body ?? {},
  )
  return data
}

// ===========================
// 人才库
// ===========================

/**
 * POST /api/v1/resume-library/import
 * 保存简历到简历库
 */
export async function importToLibrary(body: ImportLibraryRequest): Promise<LibraryDetail> {
  const { data } = await api.post<LibraryDetail>('/resume-library/import', body)
  return data
}

/**
 * GET /api/v1/resume-library
 * 查询简历库列表
 */
export async function queryLibrary(params?: LibraryQuery): Promise<LibraryListItem[]> {
  const { data } = await api.get<LibraryListItem[]>('/resume-library', { params })
  return data
}

/**
 * GET /api/v1/resume-library/{library_id}
 * 获取简历库详情
 */
export async function getLibraryDetail(libraryId: string): Promise<LibraryDetail> {
  const { data } = await api.get<LibraryDetail>(`/resume-library/${libraryId}`)
  return data
}

// ===========================
// 职位匹配
// ===========================

/**
 * POST /api/v1/job-matching/match
 * 基于 JD 匹配简历库候选人
 */
export async function matchJob(body: JobMatchRequest): Promise<JobMatchResponse> {
  const { data } = await api.post<JobMatchResponse>('/job-matching/match', body)
  return data
}

// ===========================
// 面试题推荐
// ===========================

/**
 * POST /api/v1/interview-questions/recommend
 * 基于简历推荐面试题
 */
export async function recommendInterviewQuestions(
  body: InterviewQuestionRequest,
): Promise<InterviewQuestionResponse> {
  const { data } = await api.post<InterviewQuestionResponse>(
    '/interview-questions/recommend',
    body,
  )
  return data
}
