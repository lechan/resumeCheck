// ===========================
// 通用抽取字段包装
// ===========================
export interface Field<T = string> {
  value: T | null
  confidence: number
  evidence: string[]
  derived: boolean
}

export interface DateField extends Field<string> {
  date_precision?: string | null
}

// ===========================
// 上传响应
// ===========================
export interface UploadResponse {
  resume_id: string
  task_id: string
  status: string
  file_name: string
  file_type: string
  created_at: string
}

// ===========================
// 候选人信息
// ===========================
export interface Candidate {
  name: Field
  gender: Field
  birth_date: DateField
  age: Field<number>
  phone: Field
  email: Field
  current_city: Field
  highest_degree: Field
  total_work_years: Field<number>
  [key: string]: unknown
}

// ===========================
// 教育经历
// ===========================
export interface EducationField extends Field<string> {
  date_precision?: string | null
}

export interface Education {
  edu_id?: string
  school_name?: Field
  school_type?: Field
  major?: Field
  degree?: Field
  education_type?: string
  start_date?: EducationField
  end_date?: EducationField
  is_current?: boolean
  description?: Field
  [key: string]: unknown
}

// ===========================
// 工作经历
// ===========================
export interface WorkExperience {
  work_id?: string
  company_name?: Field
  company_alias?: Field
  industry?: Field
  department?: Field
  title?: Field
  level?: string
  employment_type?: string
  start_date?: EducationField
  end_date?: EducationField
  is_current?: boolean
  duration_months?: Field<number>
  location?: Field
  description?: Field
  achievements?: unknown[]
  management_scope?: {
    team_size?: number | null
    budget?: number | null
    confidence: number
  }
  [key: string]: unknown
}

// ===========================
// 项目经历
// ===========================
export interface ProjectExperience {
  project_id?: string
  project_name?: Field
  role?: Field
  related_company?: Field
  start_date?: EducationField
  end_date?: EducationField
  description?: Field
  metrics?: unknown[]
  [key: string]: unknown
}

// ===========================
// 文件来源
// ===========================
export interface ResumeSource {
  file_name: string
  file_type: string
  mime_type: string
  file_size: number
  language: string
  pages: number
  upload_time: string
}

// ===========================
// 解析元信息
// ===========================
export interface ParseMeta {
  parser_chain: string[]
  parse_confidence: number
  ocr_used: boolean
  layout_used: boolean
  raw_text: string
  raw_blocks: object[]
}

// ===========================
// 自我评价
// ===========================
export interface SelfEvaluation {
  text: string
  confidence: number
}

// ===========================
// 结构化简历（真实 API 结构）
// ===========================
export interface ResumeSchema {
  schema_version: string
  resume_id: string
  source: ResumeSource
  parse_meta: ParseMeta
  candidate: Candidate
  education: Education[]
  work_experience: WorkExperience[]
  project_experience: ProjectExperience[]
  skills: Field[]
  certificates: Field[]
  languages: Field[]
  self_evaluation: SelfEvaluation
  timeline_index: unknown[]
  quality_flags: unknown[]
}

// ===========================
// 风险项
// ===========================
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

// ===========================
// 风险报告摘要
// ===========================
export interface RiskSummary {
  major_findings: string[]
}

// ===========================
// 风险报告（真实 API 结构）
// ===========================
export interface RiskReport {
  report_id: string
  resume_id: string
  risk_score: number // 0-100，分数越高风险越低
  risk_level: string
  risk_items: RiskItem[]
  summary: RiskSummary
  generated_at: string
}

// ===========================
// 解析结果
// ===========================
export interface ParseResult {
  parser_chain: string[]
  parse_confidence: number
  ocr_used: boolean
  layout_used: boolean
  raw_text: string
  raw_blocks: object[]
}

// ===========================
// Root 基础信息
// ===========================
export interface RootInfo {
  name: string
  version: string
  docs: string
}

// ===========================
// 健康检查
// ===========================
export interface HealthStatus {
  status: string
  services: Record<string, string>
  time: string
}

// ===========================
// 任务状态
// ===========================
export interface TaskStatus {
  resume_id: string
  task_id: string
  status: string
  progress: number
  current_stage: string
  created_at: string
  updated_at: string
}

// ===========================
// 重新分析请求体
// ===========================
export interface ReanalyzeRequest {
  force_ocr?: boolean
  rule_profile?: string
  use_llm_review?: boolean
}

// ===========================
// 风险报告下载
// ===========================
export interface ReportDownload {
  resume_id: string
  format: string
  download_url: string
}

// ===========================
// 人才库
// ===========================
export interface ImportLibraryRequest {
  resume_id: string
  tags?: string[]
  source_label?: string
}

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

export interface LibraryDetail extends LibraryListItem {
  resume: ResumeSchema
  risk_report: RiskReport
  source_label?: string
}

export interface LibraryQuery {
  keyword?: string
  risk_level?: string
  min_risk_score?: number
  tag?: string
}

// ===========================
// 职位匹配
// ===========================
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

// ===========================
// 面试题推荐
// ===========================
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
