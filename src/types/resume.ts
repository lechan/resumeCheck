// 上传响应
export interface UploadResponse {
  resume_id: string
  task_id: string
  status: string
  file_name: string
  file_type: string
  created_at: string
}

// 候选人信息
export interface Candidate {
  name: string
  email?: string
  phone?: string
  gender?: string
  age?: number
  current_position?: string
  years_of_experience?: number
}

// 教育经历
export interface Education {
  school: string
  degree?: string
  major?: string
  start_date?: string
  end_date?: string
}

// 工作经历
export interface WorkExperience {
  company: string
  position?: string
  start_date?: string
  end_date?: string
  description?: string
}

// 项目经历
export interface ProjectExperience {
  name: string
  role?: string
  start_date?: string
  end_date?: string
  description?: string
}

// 结构化简历
export interface ResumeSchema {
  resume_id: string
  source: string
  candidate: Candidate
  education: Education[]
  work_experience: WorkExperience[]
  project_experience: ProjectExperience[]
  skills: string[]
  certificates: string[]
  languages: string[]
  self_evaluation?: string
  timeline_index?: object
  quality_flags?: object
  parse_meta?: object
}

// 风险项
export interface RiskItem {
  rule_id: string
  rule_name: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  score_impact: number
  description: string
  evidence: string
  suggestion: string
}

// 风险报告
export interface RiskReport {
  report_id: string
  resume_id: string
  risk_score: number
  risk_level: string
  risk_items: RiskItem[]
  summary: string
  generated_at: string
}

// 解析结果
export interface ParseResult {
  parser_chain: string[]
  parse_confidence: number
  ocr_used: boolean
  layout_used: boolean
  raw_text: string
  raw_blocks: object[]
}

// Root 基础信息
export interface RootInfo {
  name: string
  version: string
  docs: string
}

// 健康检查
export interface HealthStatus {
  status: string
  services: Record<string, string>
  time: string
}

// 任务状态
export interface TaskStatus {
  resume_id: string
  task_id: string
  status: string
  progress: number
  current_stage: string
  created_at: string
  updated_at: string
}

// 重新分析请求体
export interface ReanalyzeRequest {
  force_ocr?: boolean
  rule_profile?: string
  use_llm_review?: boolean
}

// 风险报告下载响应
export interface ReportDownload {
  resume_id: string
  format: string
  download_url: string
}

// ---- 人才库 ----

// 导入简历库请求
export interface ImportLibraryRequest {
  resume_id: string
  tags?: string[]
  source_label?: string
}

// 简历库列表项
export interface LibraryListItem {
  library_id: string
  resume_id: string
  candidate_name: string
  current_title: string
  current_city?: string
  highest_degree?: string
  total_work_years?: number
  skills: string[]
  tags: string[]
  risk_score: number
  risk_level: string
  created_at: string
  updated_at: string
}

// 简历库详情（含完整 resume 和 risk_report）
export interface LibraryDetail extends LibraryListItem {
  resume: ResumeSchema
  risk_report: RiskReport
  source_label?: string
}

// 简历库查询参数
export interface LibraryQuery {
  keyword?: string
  risk_level?: string
  min_risk_score?: number
  tag?: string
}

// ---- 职位匹配 ----

export interface JobMatchRequest {
  job_title?: string
  job_description?: string
  required_skills?: string[]
  preferred_skills?: string[]
  keywords?: string[]
  min_years?: number
  degree_requirement?: string
  max_results?: number
  min_score?: number
}

export interface JobMatchItem {
  library_id: string
  resume_id: string
  candidate_name: string
  current_title: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  matched_keywords: string[]
  missing_keywords: string[]
  reasons: string[]
  risk_score: number
  risk_level: string
}

export interface JobMatchResponse {
  total_candidates_scanned: number
  matched_count: number
  items: JobMatchItem[]
}

// ---- 面试题推荐 ----

export interface InterviewQuestionRequest {
  resume_id?: string
  library_id?: string
  question_count?: number
  include_risk_questions?: boolean
}

export interface InterviewQuestionItem {
  question_id: string
  category: string
  difficulty: string
  question: string
  rationale: string
  related_resume_fields: string[]
  expected_signals: string[]
}

export interface InterviewQuestionResponse {
  resume_id?: string
  library_id?: string
  candidate_name: string
  items: InterviewQuestionItem[]
}
