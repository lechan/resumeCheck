import type {
  UploadResponse,
  ResumeSchema,
  RiskReport,
  RootInfo,
  HealthStatus,
  TaskStatus,
  ReportDownload,
  LibraryListItem,
  LibraryDetail,
  JobMatchResponse,
  InterviewQuestionResponse,
  ParseResult,
} from '@/types/resume'

// 模拟延迟
function delay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ===========================
// Root & 健康检查
// ===========================

export async function mockRootInfo(): Promise<RootInfo> {
  await delay(100)
  return {
    name: 'Resume Risk MVP',
    version: '0.1.0',
    docs: '/docs',
  }
}

export async function mockHealth(): Promise<HealthStatus> {
  await delay(100)
  return {
    status: 'ok',
    services: { db: 'stub', redis: 'stub', storage: 'stub' },
    time: new Date().toISOString(),
  }
}

// ===========================
// 简历解析
// ===========================

export async function mockUpload(
  _file: File,
  _options?: { force_ocr?: boolean },
): Promise<UploadResponse> {
  await delay(600)
  return {
    resume_id: 'mock_res_001',
    task_id: 'mock_task_001',
    status: 'done',
    file_name: _file.name || '示例简历.pdf',
    file_type: (_file.name?.split('.').pop()?.toLowerCase() as string) || 'pdf',
    created_at: new Date().toISOString(),
  }
}

export async function mockResumeStatus(_resumeId: string): Promise<TaskStatus> {
  await delay(200)
  return {
    resume_id: _resumeId,
    task_id: 'mock_task_001',
    status: 'done',
    progress: 100,
    current_stage: 'completed',
    created_at: new Date(Date.now() - 5000).toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function mockNormalizedResume(_resumeId: string): Promise<ResumeSchema> {
  await delay(400)
  return {
    schema_version: '1.0.0',
    resume_id: _resumeId,
    source: {
      file_name: '张明远_高级前端工程师.pdf',
      file_type: 'pdf',
      mime_type: 'application/pdf',
      file_size: 245000,
      language: 'zh-CN',
      pages: 3,
      upload_time: new Date().toISOString(),
    },
    parse_meta: {
      parser_chain: ['pdf_text'],
      parse_confidence: 0.92,
      ocr_used: false,
      layout_used: true,
      raw_text: '张明远 高级前端工程师 ...',
      raw_blocks: [],
    },
    candidate: {
      name: { value: '张明远', confidence: 0.95, evidence: [], derived: false },
      gender: { value: '男', confidence: 0.9, evidence: [], derived: false },
      birth_date: { value: '1995-03', confidence: 0.85, evidence: [], derived: false },
      age: { value: 29, confidence: 0.85, evidence: [], derived: true },
      phone: { value: '138****6789', confidence: 0.9, evidence: [], derived: false },
      email: { value: 'zhangmingyuan@example.com', confidence: 0.95, evidence: [], derived: false },
      current_city: { value: '杭州', confidence: 0.8, evidence: [], derived: true },
      highest_degree: { value: '本科', confidence: 0.9, evidence: [], derived: false },
      total_work_years: { value: 6, confidence: 0.85, evidence: [], derived: true },
    },
    education: [
      {
        edu_id: 'edu_1',
        school_name: { value: '浙江大学', confidence: 0.9, evidence: [], derived: false },
        degree: { value: '本科', confidence: 0.9, evidence: [], derived: false },
        major: { value: '计算机科学与技术', confidence: 0.9, evidence: [], derived: false },
        start_date: {
          value: '2015-09',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        end_date: {
          value: '2019-07',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        is_current: false,
      },
    ],
    work_experience: [
      {
        work_id: 'work_1',
        company_name: { value: '字节跳动', confidence: 0.9, evidence: [], derived: false },
        title: { value: '高级前端工程师', confidence: 0.85, evidence: [], derived: false },
        start_date: {
          value: '2021-04',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        end_date: {
          value: '2024-06',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        is_current: false,
        description: {
          value:
            '负责抖音电商中台前端架构设计与开发，主导搭建微前端架构体系，将 8 个业务模块拆分为独立子应用，首屏加载性能提升 40%。',
          confidence: 0.8,
          evidence: [],
          derived: false,
        },
      },
      {
        work_id: 'work_2',
        company_name: { value: '美团', confidence: 0.9, evidence: [], derived: false },
        title: { value: '前端开发工程师', confidence: 0.85, evidence: [], derived: false },
        start_date: {
          value: '2019-07',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        end_date: {
          value: '2021-03',
          date_precision: 'month',
          confidence: 0.85,
          evidence: [],
          derived: false,
        },
        is_current: false,
        description: {
          value:
            '参与美团外卖商家端前端开发，负责订单管理、数据分析等核心模块。使用 Vue.js 技术栈，推动组件库标准化建设，沉淀 30+ 业务组件。',
          confidence: 0.8,
          evidence: [],
          derived: false,
        },
      },
    ],
    project_experience: [
      {
        project_id: 'proj_1',
        project_name: { value: '微前端架构落地', confidence: 0.85, evidence: [], derived: false },
        role: { value: '前端负责人', confidence: 0.8, evidence: [], derived: false },
        start_date: {
          value: '2022-03',
          date_precision: 'month',
          confidence: 0.8,
          evidence: [],
          derived: false,
        },
        end_date: {
          value: '2022-12',
          date_precision: 'month',
          confidence: 0.8,
          evidence: [],
          derived: false,
        },
        description: {
          value:
            '主导电商中台微前端架构改造，基于 qiankun 框架实现主子应用隔离，设计统一通信协议。',
          confidence: 0.75,
          evidence: [],
          derived: false,
        },
        metrics: [],
      },
    ],
    skills: [
      { value: 'React', confidence: 0.9, evidence: [], derived: false },
      { value: 'Vue.js', confidence: 0.9, evidence: [], derived: false },
      { value: 'TypeScript', confidence: 0.9, evidence: [], derived: false },
      { value: '微前端', confidence: 0.85, evidence: [], derived: false },
      { value: 'Webpack', confidence: 0.8, evidence: [], derived: false },
      { value: 'Node.js', confidence: 0.8, evidence: [], derived: false },
    ],
    certificates: [
      { value: '软考中级 - 软件设计师', confidence: 0.9, evidence: [], derived: false },
    ],
    languages: [{ value: '英语 CET-6', confidence: 0.9, evidence: [], derived: false }],
    self_evaluation: {
      text: '6 年前端开发经验，主导过大型电商平台微前端架构改造，擅长前端工程化和性能优化。',
      confidence: 0.85,
    },
    timeline_index: [],
    quality_flags: [],
  }
}

// 模拟风险报告
export async function mockRiskReport(_resumeId: string): Promise<RiskReport> {
  await delay(600)
  return {
    report_id: 'mock_rpt_001',
    resume_id: _resumeId,
    risk_score: 72,
    risk_level: 'medium',
    risk_items: [
      {
        rule_id: 'rule_gap_001',
        rule_name: '履历断层检测',
        category: '履历完整性',
        severity: 'medium',
        hit: true,
        score_impact: 10,
        description: '2019-07 至 2019-09 期间存在约 2 个月空窗，无明确工作或学习记录。',
        evidence: [
          { text: '毕业时间: 2019-07, 第一份工作开始时间: 2019-07，但存在间断。' },
        ],
        suggestion: '建议确认该时间段的具体去向，是否有未注明的培训或待业情况。',
      },
      {
        rule_id: 'rule_jobhop_001',
        rule_name: '跳槽频率检测',
        category: '稳定性评估',
        severity: 'low',
        hit: true,
        score_impact: 8,
        description: '近 3 年内更换 1 次工作，跳槽频率在合理范围内。',
        evidence: [
          { text: '2021-04 入职字节跳动, 2024-06 离职，共 2 段工作经历。' },
        ],
        suggestion: '跳槽频率正常，但需关注离职原因是否合理。',
      },
      {
        rule_id: 'rule_desc_001',
        rule_name: '岗位描述模糊检测',
        category: '描述真实性',
        severity: 'low',
        hit: true,
        score_impact: 5,
        description: '实习生阶段的工作描述较为简略，缺乏具体项目产出和量化指标。',
        evidence: [
          { text: '描述仅提及"参与公司官网重构，使用 HTML/CSS/JS 完成页面开发"，无具体成果指标。' },
        ],
        suggestion: '建议补充该段实习经历的具体产出和量化成果，增强简历可信度。',
      },
      {
        rule_id: 'rule_time_001',
        rule_name: '时间线一致性校验',
        category: '时间逻辑',
        severity: 'high',
        hit: true,
        score_impact: 15,
        description:
          '字节跳动入职时间 2021-04 与上一段美团离职时间 2021-03 之间仅间隔 1 个月，时间衔接正常。',
        evidence: [
          { text: '美团离职: 2021-03, 字节跳动入职: 2021-04，间隔 1 个月。' },
        ],
        suggestion: '时间线衔接合理，未发现异常。',
      },
      {
        rule_id: 'rule_project_001',
        rule_name: '项目时间越界检测',
        category: '项目真实性',
        severity: 'low',
        hit: true,
        score_impact: 3,
        description: '所有项目经历时间均在对应工作经历时间范围内，未发现越界。',
        evidence: [
          { text: '微前端架构项目(2022-03~2022-12)在字节跳动任职期间内。' },
        ],
        suggestion: '项目时间符合逻辑。',
      },
    ],
    summary: {
      major_findings: [
        '毕业初期存在短期履历断层，建议核实空窗期原因',
        '实习生阶段经历描述偏弱，缺乏量化成果',
        '近 3 年跳槽频率正常，工作经历时间线清晰连贯',
        '项目经历与任职时间吻合，未发现越界问题',
      ],
    },
    generated_at: new Date().toISOString(),
  }
}

export async function mockParseResult(_resumeId: string): Promise<ParseResult> {
  await delay(300)
  return {
    parser_chain: ['docx_parser', 'text_extractor'],
    parse_confidence: 0.92,
    ocr_used: false,
    layout_used: true,
    raw_text: '张明远 高级前端工程师 ...',
    raw_blocks: [],
  }
}

export async function mockReportDownload(
  _resumeId: string,
  _format: string,
): Promise<ReportDownload> {
  await delay(200)
  return {
    resume_id: _resumeId,
    format: _format,
    download_url: `/api/v1/resumes/${_resumeId}/risk-report/download?format=${_format}`,
  }
}

export async function mockReanalyze(_resumeId: string): Promise<TaskStatus> {
  await delay(1000)
  return {
    resume_id: _resumeId,
    task_id: 'mock_task_002',
    status: 'done',
    progress: 100,
    current_stage: 'completed',
    created_at: new Date(Date.now() - 3000).toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// ===========================
// 人才库
// ===========================

export async function mockImportToLibrary(): Promise<LibraryDetail> {
  await delay(500)
  return {
    library_id: 'mock_lib_001',
    resume_id: 'mock_res_001',
    candidate_name: '张明远',
    current_title: '高级前端工程师',
    current_city: '杭州',
    highest_degree: '本科',
    total_work_years: 6,
    skills: ['React', 'Vue.js', 'TypeScript', '微前端'],
    tags: ['前端', '高级'],
    risk_score: 72,
    risk_level: 'medium',
    source_label: '校园招聘',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resume: (await mockNormalizedResume('mock_res_001')) as ResumeSchema,
    risk_report: (await mockRiskReport('mock_res_001')) as RiskReport,
  }
}

export async function mockQueryLibrary(): Promise<LibraryListItem[]> {
  await delay(400)
  return [
    {
      library_id: 'mock_lib_001',
      resume_id: 'mock_res_001',
      candidate_name: '张明远',
      current_title: '高级前端工程师',
      current_city: '杭州',
      highest_degree: '本科',
      total_work_years: 6,
      skills: ['React', 'Vue.js', 'TypeScript', '微前端'],
      tags: ['前端', '高级'],
      risk_score: 72,
      risk_level: 'medium',
      created_at: '2026-07-01T10:00:00Z',
      updated_at: '2026-07-01T10:00:00Z',
    },
    {
      library_id: 'mock_lib_002',
      resume_id: 'mock_res_002',
      candidate_name: '李思雨',
      current_title: 'Java 开发工程师',
      current_city: '北京',
      highest_degree: '硕士',
      total_work_years: 4,
      skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
      tags: ['后端', '中级'],
      risk_score: 15,
      risk_level: 'low',
      created_at: '2026-07-02T14:00:00Z',
      updated_at: '2026-07-02T14:00:00Z',
    },
  ]
}

export async function mockGetLibraryDetail(_libraryId: string): Promise<LibraryDetail> {
  return mockImportToLibrary()
}

export async function mockDeleteLibrary(_libraryId: string): Promise<{ success: boolean }> {
  await delay(300)
  return { success: true }
}

// ===========================
// 职位匹配
// ===========================

export async function mockMatchJob(): Promise<JobMatchResponse> {
  await delay(600)
  return {
    total_candidates_scanned: 12,
    matched_count: 2,
    items: [
      {
        library_id: 'mock_lib_001',
        resume_id: 'mock_res_001',
        candidate_name: '张明远',
        current_title: '高级前端工程师',
        match_score: 85,
        matched_skills: ['TypeScript', 'Node.js'],
        missing_skills: ['React'],
        matched_keywords: ['架构', '性能优化'],
        missing_keywords: ['Spring'],
        reasons: [
          '候选人具备 TypeScript 和前端架构经验，技术栈高度匹配',
          '6 年工作经验，满足岗位年限要求',
        ],
        risk_score: 72,
        risk_level: 'medium',
      },
      {
        library_id: 'mock_lib_002',
        resume_id: 'mock_res_002',
        candidate_name: '李思雨',
        current_title: 'Java 开发工程师',
        match_score: 72,
        matched_skills: ['Java', 'Spring Boot', 'MySQL'],
        missing_skills: ['Kafka'],
        matched_keywords: ['后端开发'],
        missing_keywords: ['架构'],
        reasons: ['技术栈与 JD 部分匹配，缺少 Kafka 经验', '4 年工作经验稍低于要求的 5 年'],
        risk_score: 15,
        risk_level: 'low',
      },
    ],
  }
}

// ===========================
// 面试题推荐
// ===========================

export async function mockRecommendInterviewQuestions(): Promise<InterviewQuestionResponse> {
  await delay(500)
  return {
    resume_id: 'mock_res_001',
    candidate_name: '张明远',
    items: [
      {
        question_id: 'q_001',
        category: '技术能力',
        difficulty: 'medium',
        question: '请描述你在字节跳动主导微前端架构改造时，如何处理主子应用之间的状态共享和通信？',
        rationale: '候选人在字节跳动有微前端架构经验，此题验证其架构设计能力',
        related_resume_fields: ['work_experience', 'project_experience'],
        expected_signals: ['架构理解深度', '跨应用状态管理', 'qiankun 框架掌握'],
      },
      {
        question_id: 'q_002',
        category: '技术能力',
        difficulty: 'hard',
        question: '在抖音电商中台，首屏性能提升 40% 具体是通过哪些手段实现的？',
        rationale: '候选人在工作中提到性能优化成果，验证其是否真正主导相关工作',
        related_resume_fields: ['work_experience'],
        expected_signals: ['性能优化方法论', '具体技术手段', '量化思维'],
      },
      {
        question_id: 'q_003',
        category: '项目经验',
        difficulty: 'medium',
        question: '在美团期间沉淀的 30+ 业务组件中，请举一个最复杂的组件，说明其设计和实现思路',
        rationale: '验证候选人组件化开发的深度',
        related_resume_fields: ['work_experience'],
        expected_signals: ['组件设计能力', '抽象能力', '代码复用意识'],
      },
      {
        question_id: 'q_004',
        category: '职业发展',
        difficulty: 'easy',
        question: '为什么从字节跳动离职？未来 3 年的职业规划是什么？',
        rationale: '结合跳槽频率风险项，了解离职动机和职业稳定性',
        related_resume_fields: ['candidate', 'work_experience'],
        expected_signals: ['职业规划清晰度', '离职原因合理性', '稳定性预期'],
      },
      {
        question_id: 'q_005',
        category: '风险核验',
        difficulty: 'easy',
        question: '2019 年 7 月至 9 月期间的具体去向？这段时间是否有未列出的培训或项目经历？',
        rationale: '风险报告指出履历存在 2 个月空窗期，此题核验该时间段的实际情况',
        related_resume_fields: ['timeline_index'],
        expected_signals: ['空窗期合理性', '回答诚实度'],
      },
    ],
  }
}
