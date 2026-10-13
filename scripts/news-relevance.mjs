// Chinese general-tech feeds mix research with ads, product launches, and
// company news. Require an editorial signal in the headline itself: either a
// learning/skills connection or a concrete frontier-technology development.
const commercialHeadline = /手机|旗舰|折叠屏|平板电脑|笔记本电脑|耳机|家电|新车|车型|轿车|越野车|SUV|小定|预售|开售|售价|焕新价|交付量|累计交付|产销快报|销量|票房|网剧|短剧|影视|电影|编剧|游戏本|月收入|月薪|融资|估值|IPO|股价|财报|营收|GMV|裁员|人事调整|离职|供应商|出海|电商|营销|广告|品牌合作|战略合作|合作伙伴|领投|跟投|收购|上市：|新品发布会|限免|限时|直播回顾|将亮相|将于.{0,20}(举办|召开|开幕)|盲约|企业级|办公|产业生态大会|护城河|碳硅道统|医患|临床|医院|肿瘤|癌症|医保|健康管理|市场观察|市场研究报告|年度榜单|榜单第一|全球第一|第一梯队|产业合作|公司战略|公司牵头|访谈|专访/iu;
const educationHeadline = /教育|教学|教师|学生|课堂|课程|校园|学校|高校|大学|职教|职业教育|编程|STEM|创客|学习科学|学习者|人才培养|技能大赛|教学评测/iu;
const frontierHeadline = /\bAI\b|人工智能|大模型|模型|DeepSeek|Qwen|千问|GPT|Gemini|Claude|机器人|具身|智能体|多模态|芯片|算力|量子|航天|卫星|脑机|神经科学|3D打印|增材制造|世界模型|机器学习|深度学习|自动驾驶/iu;
const evidenceHeadline = /论文|研究|实验|算法|框架|架构|基准|评测|测试|开源|训练|推理|数据集|传感|触觉|机械臂|量子计算|脑机接口|模拟|仿真|漏洞|Bug|失效|一致性|鲁棒性|RSI|IROS|ICML|NeurIPS|ECCV|ICLR|CVPR|ACL/iu;

export function isRelevantChineseNews(row) {
  const title = String(row.title ?? "").trim();
  if (!title || commercialHeadline.test(title)) return false;
  return (educationHeadline.test(title) && frontierHeadline.test(title)) ||
    (frontierHeadline.test(title) && evidenceHeadline.test(title));
}
