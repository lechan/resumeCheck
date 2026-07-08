import type { UploadResponse, ResumeSchema, RiskReport } from '@/types/resume'

// 模拟延迟
function delay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 模拟上传响应
export async function mockUpload(_file: File, _forceOcr = false): Promise<UploadResponse> {
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

// 模拟结构化简历
export async function mockNormalizedResume(_resumeId: string): Promise<ResumeSchema> {
  await delay(400)
  return {
    resume_id: _resumeId,
    source: 'mock',
    candidate: {
      name: '张明远',
      email: 'zhangmingyuan@example.com',
      phone: '138****6789',
      gender: '男',
      age: 29,
      current_position: '高级前端工程师',
      years_of_experience: 6,
    },
    education: [
      {
        school: '浙江大学',
        degree: '本科',
        major: '计算机科学与技术',
        start_date: '2015-09',
        end_date: '2019-07',
      },
    ],
    work_experience: [
      {
        company: '字节跳动',
        position: '高级前端工程师',
        start_date: '2021-04',
        end_date: '2024-06',
        description:
          '负责抖音电商中台前端架构设计与开发，主导搭建微前端架构体系，将 8 个业务模块拆分为独立子应用，首屏加载性能提升 40%。使用 React + TypeScript 重构核心交易链路，日均处理订单超百万级。',
      },
      {
        company: '美团',
        position: '前端开发工程师',
        start_date: '2019-07',
        end_date: '2021-03',
        description:
          '参与美团外卖商家端前端开发，负责订单管理、数据分析等核心模块。使用 Vue.js 技术栈，推动组件库标准化建设，沉淀 30+ 业务组件。',
      },
      {
        company: '杭州某科技有限公司',
        position: '前端实习生',
        start_date: '2018-07',
        end_date: '2018-12',
        description: '参与公司官网重构，使用 HTML/CSS/JS 完成页面开发。',
      },
    ],
    project_experience: [
      {
        name: '微前端架构落地',
        role: '前端负责人',
        start_date: '2022-03',
        end_date: '2022-12',
        description:
          '主导电商中台微前端架构改造，基于 qiankun 框架实现主子应用隔离，设计统一通信协议，解决跨应用状态共享问题。',
      },
      {
        name: '组件库建设',
        role: '核心开发者',
        start_date: '2020-06',
        end_date: '2021-01',
        description: '参与组件库标准化建设，制定组件 API 规范，编写文档和单元测试。',
      },
    ],
    skills: [
      'React',
      'Vue.js',
      'TypeScript',
      '微前端',
      'Webpack',
      'Node.js',
      '性能优化',
      'Git',
    ],
    certificates: ['软考中级 - 软件设计师'],
    languages: ['英语 CET-6'],
    self_evaluation:
      '6 年前端开发经验，主导过大型电商平台微前端架构改造，擅长前端工程化和性能优化。在字节跳动期间作为核心前端开发，深刻理解大规模前端应用的架构设计。',
    timeline_index: {},
    quality_flags: {},
  }
}

// 模拟风险报告
export async function mockRiskReport(_resumeId: string): Promise<RiskReport> {
  await delay(600)
  return {
    report_id: 'mock_rpt_001',
    resume_id: _resumeId,
    risk_score: 28,
    risk_level: 'medium',
    risk_items: [
      {
        rule_id: 'rule_gap_001',
        rule_name: '履历断层检测',
        category: '履历完整性',
        severity: 'medium',
        score_impact: 10,
        description: '2019-07 至 2019-09 期间存在约 2 个月空窗，无明确工作或学习记录。',
        evidence: '毕业时间: 2019-07, 第一份工作开始时间: 2019-07，但存在间断。',
        suggestion: '建议确认该时间段的具体去向，是否有未注明的培训或待业情况。',
      },
      {
        rule_id: 'rule_jobhop_001',
        rule_name: '跳槽频率检测',
        category: '稳定性评估',
        severity: 'low',
        score_impact: 8,
        description: '近 3 年内更换 1 次工作，跳槽频率在合理范围内。',
        evidence: '2021-04 入职字节跳动, 2024-06 离职，共 2 段工作经历。',
        suggestion: '跳槽频率正常，但需关注离职原因是否合理。',
      },
      {
        rule_id: 'rule_desc_001',
        rule_name: '岗位描述模糊检测',
        category: '描述真实性',
        severity: 'low',
        score_impact: 5,
        description: '实习生阶段的工作描述较为简略，缺乏具体项目产出和量化指标。',
        evidence: '描述仅提及"参与公司官网重构，使用 HTML/CSS/JS 完成页面开发"，无具体成果指标。',
        suggestion: '建议补充该段实习经历的具体产出和量化成果，增强简历可信度。',
      },
      {
        rule_id: 'rule_time_001',
        rule_name: '时间线一致性校验',
        category: '时间逻辑',
        severity: 'high',
        score_impact: 15,
        description: '字节跳动入职时间 2021-04 与上一段美团离职时间 2021-03 之间仅间隔 1 个月，时间衔接正常。',
        evidence: '美团离职: 2021-03, 字节跳动入职: 2021-04，间隔 1 个月。',
        suggestion: '时间线衔接合理，未发现异常。',
      },
      {
        rule_id: 'rule_project_001',
        rule_name: '项目时间越界检测',
        category: '项目真实性',
        severity: 'low',
        score_impact: 3,
        description: '所有项目经历时间均在对应工作经历时间范围内，未发现越界。',
        evidence: '微前端架构项目(2022-03~2022-12)在字节跳动任职期间内。',
        suggestion: '项目时间符合逻辑。',
      },
    ],
    summary:
      '该候选人整体风险指数为 28 分（中等风险）。主要关注点包括：毕业初期存在短期履历断层、实习生阶段经历描述偏弱。优势方面，近 3 年跳槽频率正常，工作经历时间线清晰连贯，项目经历与任职时间吻合。建议重点核实毕业空窗期原因。',
    generated_at: new Date().toISOString(),
  }
}
