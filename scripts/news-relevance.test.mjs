import assert from "node:assert/strict";
import test from "node:test";
import { isRelevantChineseNews } from "./news-relevance.mjs";

test("keeps school and research signals", () => {
  const titles = [
    "师生激辩外滩大会：云谷学校论坛给出一份教育AI使用说明书",
    "何恺明团队发布多模态Harness框架",
    "字节发现 DeepSeek 隐藏 Bug，加点空格，模型翻车",
    "研究了1933篇 IROS 论文，我们看到了机器人学的六项新变化",
    "用不着Ctrl+F了！全新AI论文工具，帮你在原文献里海里捞针",
  ];
  for (const title of titles) assert.equal(isRelevantChineseNews({ title }), true, title);
});

test("rejects consumer, commercial, and unrelated stories", () => {
  const titles = [
    "一加 16 产品力全面升级，打造史上最强全能旗舰，首发AI芯片",
    "苹果交出第一份折叠作业，华为已经把答案写了八年",
    "吉利银河战舰700上市：限时焕新价16.98万元起，押注电混与智能越野",
    "安踏×火山引擎：Agent跑进全球电商业务",
    "蚂蚁集团领投，戴盟两月内连获数亿元融资，以触觉能力破局物理AI",
    "豆包工作新增画布功能，并接入豆包2.1 Lite模型",
    "《柳叶刀》研究表明：AI 有望改善医患关系",
    "AI大模型工场2026 AI产业生态大会今日举办",
    "《碳硅道统·跨域迁移治理法典》七层体系目录",
  ];
  for (const title of titles) assert.equal(isRelevantChineseNews({ title }), false, title);
});
