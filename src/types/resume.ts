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
