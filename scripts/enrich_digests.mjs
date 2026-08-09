import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'src', 'data', 'digests.json');
const digests = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const additions = [
  {
    id: 'research-question-intake', date: '2026-03-26', topic: 'AI tools for researchers', series: 'Workflow clinic', readTime: '5 min', audience: 'Graduate researchers',
    title: 'Turn a vague research request into a verifiable question', titleZh: '把模糊研究需求转化为可核验的问题',
    source: 'https://arxiv.org/abs/2303.08774', sourceLabel: 'Public source: GPT-4 technical report', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'What should an intake form capture before an AI research assistant searches for evidence?', questionZh: 'AI 研究助手开始检索前，需求表应该记录什么？',
    method: 'Editorial synthesis connecting task scope, evidence constraints, and review ownership to a lightweight intake form.', methodZh: '将任务范围、证据约束和审核责任连接到轻量需求表的编辑性综合。',
    finding: 'A useful intake form makes the decision, audience, evidence boundary, and acceptable uncertainty explicit before retrieval begins. This reduces the chance that a fluent answer solves the wrong problem.', findingZh: '有效的需求表应在检索前明确决策、受众、证据边界和可接受的不确定性，减少流畅回答解决错问题的情况。',
    limitation: 'The workflow needs task-completion testing with real researchers.', limitationZh: '该工作流仍需真实研究者的任务完成测试。',
    takeaways: ['Ask for the decision, not only the topic.', 'Capture evidence constraints early.', 'Assign a human review owner.'], tags: ['AI tools', 'research workflow'], related: ['research-agent-quality', 'human-review-loops']
  },
  {
    id: 'model-card-decisions', date: '2026-03-19', topic: 'AI governance', series: 'Governance notes', readTime: '6 min', audience: 'AI product and policy researchers',
    title: 'Use model-card fields as product decisions, not documentation afterthoughts', titleZh: '把模型卡字段变成产品决策，而不是事后文档',
    source: 'https://arxiv.org/abs/1810.03993', sourceLabel: 'Public source: Model Cards for Model Reporting', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'Which model-card fields should change the way a research tool is released?', questionZh: '模型卡中的哪些字段应该改变研究工具的发布方式？',
    method: 'Product mapping exercise from intended use, limitations, and evaluation context to release controls.', methodZh: '将预期用途、限制和评测情境映射到发布控制的产品分析练习。',
    finding: 'Intended use and limitations become useful only when connected to a release decision: a warning, a restricted workflow, or a required reviewer. Documentation should therefore have an owner and a trigger.', findingZh: '只有当预期用途和限制连接到警示、受限工作流或必需审核者等发布决定时，文档才真正有用，因此文档需要负责人和触发条件。',
    limitation: 'This brief does not assess any particular model or legal obligation.', limitationZh: '本简报不评估特定模型，也不构成法律意见。',
    takeaways: ['Make limitations actionable.', 'Version release decisions.', 'Separate reporting from certification.'], tags: ['AI governance', 'model documentation'], related: ['ai-governance-signals', 'policy-review-queue']
  },
  {
    id: 'dataset-provenance', date: '2026-03-12', topic: 'Research workflow', series: 'Evidence notes', readTime: '5 min', audience: 'Research operations teams',
    title: 'A provenance checklist for datasets used in AI research briefs', titleZh: 'AI 研究简报数据集溯源清单',
    source: 'https://arxiv.org/abs/1803.09010', sourceLabel: 'Public source: Datasheets for Datasets', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'What minimum provenance fields make a dataset claim reusable by another researcher?', questionZh: '哪些最低溯源字段能让另一位研究者复用数据集论断？',
    method: 'Field-level product contract for motivation, composition, collection process, and recommended uses.', methodZh: '围绕动机、组成、采集过程和推荐用途的数据字段产品契约。',
    finding: 'A source link is not enough. A brief should preserve why the data exists, how it was collected, which populations may be missing, and what use is out of scope.', findingZh: '仅有来源链接并不够。简报还应保留数据为何存在、如何采集、哪些群体可能缺失以及哪些用途不在范围内。',
    limitation: 'The checklist is a product template and has not been applied to a licensed production corpus.', limitationZh: '该清单是产品模板，尚未应用于有许可的生产语料。',
    takeaways: ['Keep provenance next to the claim.', 'Name missing populations.', 'State prohibited uses.'], tags: ['research workflow', 'data provenance'], related: ['evidence-objects', 'source-traceability']
  },
  {
    id: 'factscore-editorial-gate', date: '2026-03-05', topic: 'Quality evaluation', series: 'Evaluation notes', readTime: '6 min', audience: 'AI evaluation practitioners',
    title: 'Borrow atomic-claim thinking for a digest quality gate', titleZh: '用原子论断思维设计简报质量闸门',
    source: 'https://arxiv.org/abs/2305.14251', sourceLabel: 'Public source: FActScore', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'How can an editor spot unsupported specificity without reading every sentence the same way?', questionZh: '编辑如何快速发现缺乏依据的具体表述？',
    method: 'Editorial adaptation of atomic-claim decomposition into source quote, support status, and rewrite action.', methodZh: '将原子论断拆分适配为来源摘录、支持状态和改写动作。',
    finding: 'Breaking a paragraph into atomic claims gives the reviewer a smaller unit for evidence checking. The product should expose unsupported claims rather than hide them inside an overall score.', findingZh: '将段落拆成原子论断能让审核者以更小单位核验依据；产品应暴露未支持论断，而不是用总分掩盖它们。',
    limitation: 'The adaptation is not a reproduction of the cited benchmark.', limitationZh: '该适配不是对引用基准的复现。',
    takeaways: ['Review claims at the right granularity.', 'Attach quotes to decisions.', 'Keep scores explainable.'], tags: ['quality evaluation', 'source traceability'], related: ['quality-gates-bilingual', 'human-review-loops']
  },
  {
    id: 'helm-metric-selection', date: '2026-02-26', topic: 'Quality evaluation', series: 'Evaluation notes', readTime: '7 min', audience: 'AI product managers',
    title: 'Choose an evaluation slice before choosing a model score', titleZh: '先选评测切片，再选择模型分数',
    source: 'https://arxiv.org/abs/2211.09110', sourceLabel: 'Public source: HELM', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'Which evaluation slices matter for a bilingual research digest?', questionZh: '双语研究简报应该关注哪些评测切片？',
    method: 'Scenario matrix covering language, task, risk, and audience before selecting aggregated metrics.', methodZh: '在选择聚合指标前，先建立覆盖语言、任务、风险和受众的场景矩阵。',
    finding: 'A single average can hide a failure in a high-risk slice. Product reporting should show the task, language, and risk context next to the score and route failures to review.', findingZh: '单一平均分可能掩盖高风险切片的失败；产品报告应将任务、语言和风险情境与分数并列，并把失败送入人工审核。',
    limitation: 'The local fixture is too small to estimate model performance.', limitationZh: '本地样例太小，不能估计模型生产性能。',
    takeaways: ['Report slices with averages.', 'Make high-risk failures visible.', 'Version the evaluation set.'], tags: ['evaluation', 'bilingual'], related: ['research-agent-quality', 'quality-gates-bilingual']
  },
  {
    id: 'rag-evidence-handoff', date: '2026-02-19', topic: 'AI tools for researchers', series: 'Tool workflows', readTime: '6 min', audience: 'Research tool builders',
    title: 'Design the handoff between retrieval and editorial review', titleZh: '设计检索与编辑审核之间的交接',
    source: 'https://arxiv.org/abs/2312.10997', sourceLabel: 'Public source: Retrieval-augmented generation survey', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'What should a retrieval system hand to an editor besides generated prose?', questionZh: '检索系统除了生成文字，还应交给编辑什么？',
    method: 'Workflow design for retrieved passages, source metadata, confidence caveats, and unresolved claims.', methodZh: '围绕检索片段、来源元数据、置信度边界和未解决论断的工作流设计。',
    finding: 'The valuable handoff is an evidence bundle: passages, source metadata, claim links, and unresolved questions. A polished paragraph without this bundle increases review cost instead of reducing it.', findingZh: '有价值的交接物是证据包：片段、来源元数据、论断链接和未解决问题；没有证据包的流畅段落反而会增加审核成本。',
    limitation: 'The source is used for workflow framing, not for a benchmark claim.', limitationZh: '该来源用于工作流框架，不用于声称基准结果。',
    takeaways: ['Return evidence with prose.', 'Expose unresolved claims.', 'Measure review rework.'], tags: ['RAG', 'research workflow'], related: ['evidence-objects', 'research-agent-quality']
  },
  {
    id: 'nistu-ai-risk-intake', date: '2026-02-12', topic: 'AI governance', series: 'Governance notes', readTime: '5 min', audience: 'AI governance teams',
    title: 'Translate an AI risk framework into an editorial intake step', titleZh: '把 AI 风险框架转成编辑接收步骤',
    source: 'https://www.nist.gov/itl/ai-risk-management-framework', sourceLabel: 'Public source: NIST AI RMF', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'Which risk questions belong before a research brief enters the publication queue?', questionZh: '研究简报进入发布队列前应回答哪些风险问题？',
    method: 'Product interpretation of govern, map, measure, and manage as intake fields and escalation triggers.', methodZh: '将 govern、map、measure、manage 解读为接收字段和升级触发器。',
    finding: 'Risk intake should ask who may act on the brief, what evidence is missing, and which reviewer owns the decision. The framework is useful as a routing aid, not as a claim of certification.', findingZh: '风险接收应询问谁可能据此行动、缺什么证据以及谁负责决策；框架适合作为路由辅助，而非认证声明。',
    limitation: 'This is an implementation sketch and not an official NIST interpretation.', limitationZh: '这是实施草案，不是 NIST 官方解释。',
    takeaways: ['Route risk before publication.', 'Name the decision owner.', 'Keep certification claims out of scope.'], tags: ['AI governance', 'risk'], related: ['policy-review-queue', 'ai-governance-signals']
  },
  {
    id: 'platform-politics-evidence', date: '2026-02-05', topic: 'AI and politics', series: 'Politics reading room', readTime: '6 min', audience: 'Political science and IR researchers',
    title: 'Separate platform evidence from political interpretation', titleZh: '区分平台证据与政治学解释',
    source: 'https://arxiv.org/abs/2005.14165', sourceLabel: 'Public source: Language Models are Few-Shot Learners', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'How should a digest prevent a model-generated interpretation from looking like an observed political fact?', questionZh: '如何防止模型生成的解释看起来像已观察到的政治事实？',
    method: 'Editorial schema separating source observation, analyst interpretation, uncertainty, and transfer conditions.', methodZh: '将来源观察、分析者解释、不确定性和迁移条件分开的编辑 schema。',
    finding: 'A political reading note should label what the source measured and what the editor inferred. The handoff is especially important when a language model turns a descriptive source into a causal-sounding sentence.', findingZh: '政治学阅读笔记应标注来源测量了什么、编辑推断了什么；当语言模型把描述性来源改写成因果语气时，这一交接尤其重要。',
    limitation: 'The cited paper is a language-model source, not evidence for a political claim.', limitationZh: '引用论文是语言模型来源，不是政治论断的证据。',
    takeaways: ['Label observation and interpretation.', 'Avoid causal verbs without design evidence.', 'Show transfer conditions.'], tags: ['AI and politics', 'editorial integrity'], related: ['platform-politics-reading', 'source-traceability']
  },
  {
    id: 'ai-act-risk-language', date: '2026-01-29', topic: 'AI governance', series: 'Governance notes', readTime: '6 min', audience: 'International policy researchers',
    title: 'A plain-language risk label for cross-region research content', titleZh: '面向跨地区研究内容的通俗风险标签',
    source: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', sourceLabel: 'Public source: EU AI Act text', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'How can a research content team expose regional uncertainty without pretending to provide legal advice?', questionZh: '研究内容团队如何暴露地区不确定性而不冒充法律意见？',
    method: 'Content-label proposal using region, claim type, evidence status, and human-review owner fields.', methodZh: '基于地区、论断类型、证据状态和人工审核负责人字段的内容标签方案。',
    finding: 'A region label should explain why review is needed and link to the source rule, while avoiding a global “compliant” badge. The product decision is to make uncertainty actionable and reversible.', findingZh: '地区标签应解释为何需要审核并链接规则来源，避免使用全球“合规”徽章；产品决策是让不确定性可行动、可撤回。',
    limitation: 'This is not legal advice and does not map the Act to a specific product.', limitationZh: '这不是法律意见，也没有将法规映射到具体产品。',
    takeaways: ['Use source-linked labels.', 'Avoid universal approval language.', 'Escalate high-impact claims.'], tags: ['AI governance', 'cross-region'], related: ['nistu-ai-risk-intake', 'policy-review-queue']
  },
  {
    id: 'translation-parity', date: '2026-01-22', topic: 'Quality evaluation', series: 'Bilingual clinic', readTime: '5 min', audience: 'Bilingual research readers',
    title: 'Treat bilingual parity as meaning preservation, not word-for-word similarity', titleZh: '把双语一致性定义为意义保留，而不是逐词相似',
    source: 'https://arxiv.org/abs/2303.08774', sourceLabel: 'Public source: GPT-4 technical report', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'Which bilingual checks catch a materially different research implication?', questionZh: '哪些双语检查能发现研究含义发生实质变化？',
    method: 'Reviewer checklist for claim scope, uncertainty, actor, timeframe, and evidence status across languages.', methodZh: '针对不同语言中的论断范围、不确定性、主体、时间和证据状态的审核清单。',
    finding: 'Parity review should compare decision-relevant meaning: who acted, how certain the claim is, and what evidence supports it. Literal fluency can coexist with a changed risk boundary.', findingZh: '一致性审核应比较影响决策的含义：谁做了什么、论断有多确定、证据是什么；文字流畅并不代表风险边界没有变化。',
    limitation: 'A real parity score requires blinded bilingual reviewers.', limitationZh: '真实一致性分数需要双语盲审者。',
    takeaways: ['Review claims, not only grammar.', 'Preserve uncertainty markers.', 'Route material differences to adjudication.'], tags: ['bilingual', 'quality evaluation'], related: ['quality-gates-bilingual', 'human-review-loops']
  },
  {
    id: 'researcher-subscription-loop', date: '2026-01-15', topic: 'Research workflow', series: 'Product signals', readTime: '6 min', audience: 'Research tool product managers',
    title: 'Design a subscription loop around a recurring research decision', titleZh: '围绕持续研究决策设计订阅闭环',
    source: 'https://arxiv.org/abs/2211.09110', sourceLabel: 'Public source: HELM evaluation framework', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'What should make a researcher return to a digest instead of opening a one-off summary?', questionZh: '什么能让研究者回到简报，而不是只打开一次摘要？',
    method: 'Product hypothesis connecting recurring topic subscriptions, source verification, saved evidence, and next-action prompts.', methodZh: '将主题订阅、来源核验、证据保存和下一步提示连接起来的产品假设。',
    finding: 'A recurring digest earns a return visit when it remembers the researcher’s question and surfaces what changed. Subscription is therefore a workflow commitment, not only an email frequency setting.', findingZh: '当简报记住研究者的问题并指出变化时，才有理由回访；订阅是工作流承诺，而不只是邮件频率设置。',
    limitation: 'The return-loop hypothesis needs real activation and retention observation.', limitationZh: '回访闭环假设仍需真实激活和留存观察。',
    takeaways: ['Subscribe to a question.', 'Show what changed.', 'Measure return behavior after first value.'], tags: ['product signals', 'research workflow'], related: ['research-question-intake', 'evidence-objects']
  },
  {
    id: 'source-traceability', date: '2026-01-08', topic: 'Research workflow', series: 'Evidence notes', readTime: '5 min', audience: 'AI product and research teams',
    title: 'Make source traceability a navigation pattern', titleZh: '把来源可追溯性做成导航模式',
    source: 'https://arxiv.org/abs/1803.09010', sourceLabel: 'Public source: Datasheets for Datasets', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'How can a reader move from a short finding to the exact evidence boundary?', questionZh: '读者如何从简短发现快速回到确切的证据边界？',
    method: 'Interface proposal for source badges, claim-to-quote links, limitations, and related research questions.', methodZh: '针对来源标签、论断到摘录链接、限制和相关研究问题的界面方案。',
    finding: 'Source traceability is easier to use when it is part of the reading path, not hidden in a bibliography. The UI should show the evidence status at the moment a reader decides whether to reuse a finding.', findingZh: '当来源追溯成为阅读路径的一部分，而不是隐藏在参考文献中时，更容易被使用；界面应在读者决定复用发现的瞬间显示证据状态。',
    limitation: 'The prototype has no telemetry proving that source clicks improve decisions.', limitationZh: '原型没有遥测数据证明来源点击会改善决策。',
    takeaways: ['Put evidence beside the claim.', 'Make limitations scannable.', 'Track source verification as a future event.'], tags: ['source traceability', 'research tools'], related: ['dataset-provenance', 'evidence-objects']
  },
  {
    id: 'editorial-changelog', date: '2026-01-01', topic: 'AI governance', series: 'Operations notes', readTime: '5 min', audience: 'Research operations teams',
    title: 'A changelog for editorial rules and model-assisted workflows', titleZh: '为编辑规则和模型辅助工作流建立变更日志',
    source: 'https://www.nist.gov/itl/ai-risk-management-framework', sourceLabel: 'Public source: NIST AI RMF', sourceStatus: 'PUBLIC SOURCE / EDITORIAL DEMO',
    question: 'Which workflow changes should be visible to a reader and to a reviewer?', questionZh: '哪些工作流变化应该同时对读者和审核者可见？',
    method: 'Change-management template covering rule version, affected content, regression sample, owner, and rollback note.', methodZh: '覆盖规则版本、受影响内容、回归样例、负责人和回滚说明的变更管理模板。',
    finding: 'A changelog makes quality changes explainable: a lower release rate may follow a stricter provenance rule rather than a model regression. Version history protects the team from comparing incompatible evaluation runs.', findingZh: '变更日志让质量变化可解释：发布率下降可能是来源规则变严格，而不是模型退化；版本历史也避免比较不兼容的评测运行。',
    limitation: 'The local changelog contains demonstration entries only.', limitationZh: '本地变更日志仅包含演示条目。',
    takeaways: ['Version rules and prompts together.', 'Attach regression cases.', 'Record rollback conditions.'], tags: ['operations', 'AI governance'], related: ['nistu-ai-risk-intake', 'research-agent-quality']
  }
];

const seen = new Set(digests.map((item) => item.id));
for (const item of additions) if (!seen.has(item.id)) digests.push(item);
for (const item of digests) {
  item.author = item.author || 'AI Research Digest editorial demo';
  item.authorStatus = item.authorStatus || 'SYNTHETIC DEMO DATA';
  item.datePublished = item.datePublished || item.date;
  item.dateModified = item.dateModified || item.date;
  item.evidenceLevel = item.evidenceLevel || 'public-source / editorial synthesis';
  item.nextAction = item.nextAction || 'Human editor verifies source, limitation, and audience fit before publication.';
  item.contentStatus = item.contentStatus || 'EDITORIAL DEMO / HUMAN REVIEW REQUIRED';
}
fs.writeFileSync(dataPath, JSON.stringify(digests, null, 2) + '\n', 'utf8');
console.log(`wrote ${digests.length} enriched digest records to ${dataPath}`);
