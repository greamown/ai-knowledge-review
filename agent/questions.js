window.QUIZ_QUESTIONS = [
  {
    q: "Production Agent 中，哪一層最適合作為真正的安全邊界？",
    choices: [
      "System Prompt",
      "Policy / Permission Layer",
      "LLM Temperature",
      "Conversation Summary",
    ],
    answer: 1,
    explain:
      "Prompt 不是 security boundary。真正的安全限制要落在 Policy、Permission、Sandbox 與執行層。",
    en: {
      q: "In a production agent, which layer is the best security boundary?",
      choices: [
        "System prompt",
        "Policy / permission layer",
        "LLM temperature",
        "Conversation summary",
      ],
      explain:
        "Prompts are not a security boundary. Enforce restrictions in policies, permissions, sandboxes, and the execution layer.",
    },
    topic: "security",
  },
  {
    q: "LLM 產生 tool call 後，Production 系統最合理的下一步是？",
    choices: [
      "直接呼叫 API",
      "先做 schema validation 與 authorization",
      "存進 Vector DB",
      "重新訓練模型",
    ],
    answer: 1,
    explain: "LLM output 要視為 untrusted input。",
    en: {
      q: "After an LLM generates a tool call, what should a production system do next?",
      choices: [
        "Call the API immediately",
        "Validate the schema and authorize the call",
        "Store it in a vector database",
        "Retrain the model",
      ],
      explain: "Treat LLM output as untrusted input.",
    },
    topic: "tools",
  },
  {
    q: "哪一項最符合 Context Engineering 的核心？",
    choices: [
      "永遠放全部歷史",
      "只保留最新一輪",
      "讓模型看到當下最相關資訊",
      "Context 越長越準",
    ],
    answer: 2,
    explain: "目標是 relevance，不是單純最大化 context。",
    en: {
      q: "Which best describes the goal of context engineering?",
      choices: [
        "Always include the full history",
        "Keep only the latest turn",
        "Provide the most relevant information for the current task",
        "Longer context is always more accurate",
      ],
      explain: "The goal is relevance, rather than simply maximizing context.",
    },
    topic: "context",
  },
  {
    q: "Sliding Window 最大的風險是？",
    choices: [
      "GPU 溫度上升",
      "遺失早期重要 constraint",
      "不能做 embedding",
      "不能用 tool",
    ],
    answer: 1,
    explain: "FIFO truncate 可能把重要 policy 或 decision 刪掉。",
    en: {
      q: "What is the greatest risk of a sliding window?",
      choices: [
        "Higher GPU temperature",
        "Losing important early constraints",
        "Inability to create embeddings",
        "Inability to use tools",
      ],
      explain: "FIFO truncation can remove important policies or decisions.",
    },
    topic: "context",
  },
  {
    q: "Summary Memory 最主要的風險是？",
    choices: ["Bandwidth", "Information Loss", "無法做 JSON", "必須用 GPU"],
    answer: 1,
    explain: "精確欄位容易在摘要時遺失。",
    en: {
      q: "What is the main risk of summary memory?",
      choices: [
        "Bandwidth",
        "Information loss",
        "JSON cannot be used",
        "A GPU is required",
      ],
      explain: "Precise fields can be lost when summarizing.",
    },
    topic: "context",
  },
  {
    q: "History、Memory、RAG 的正確對應是？",
    choices: [
      "外部知識/最近對話/模型參數",
      "最近對話/應記住資訊/外部相關知識",
      "三者一樣",
      "RAG 只用於圖片",
    ],
    answer: 1,
    explain: "這三者用途不同。",
    en: {
      q: "Which correctly maps history, memory, and RAG?",
      choices: [
        "External knowledge / recent conversation / model parameters",
        "Recent conversation / information to remember / relevant external knowledge",
        "All three are the same",
        "RAG is only for images",
      ],
      explain:
        "Each serves a different purpose: past conversations, retained information, and external knowledge.",
    },
    topic: "rag",
  },
  {
    q: "RAG 的 Top-K 越大通常會帶來什麼？",
    choices: [
      "一定更準",
      "Noise、Token、Latency 可能上升",
      "沒影響",
      "只會降低 Recall",
    ],
    answer: 1,
    explain: "Recall 可能提高，但同時有 context dilution。",
    en: {
      q: "What can increasing RAG Top-K cause?",
      choices: [
        "Guaranteed higher accuracy",
        "More noise, tokens, and latency",
        "No effect",
        "Only lower recall",
      ],
      explain: "Recall may improve, but context dilution can also increase.",
    },
    topic: "rag",
  },
  {
    q: "Multimodal RAG 對 PDF 的較佳做法是？",
    choices: [
      "全部 OCR 成文字",
      "Layout Parsing 後分別處理 text/table/image/metadata",
      "把 PDF 當一張圖",
      "只保留 caption",
    ],
    answer: 1,
    explain: "不同模態應保留各自結構。",
    en: {
      q: "What is a good approach to multimodal RAG for PDFs?",
      choices: [
        "OCR everything into plain text",
        "Parse the layout and handle text, tables, images, and metadata separately",
        "Treat the PDF as a single image",
        "Keep only captions",
      ],
      explain: "Preserve the structure of each modality.",
    },
    topic: "multimodal",
  },
  {
    q: "固定且可預測的流程，通常優先使用？",
    choices: [
      "Multi-Agent Debate",
      "Deterministic Workflow / State Machine",
      "無限 ReAct",
      "Planner Agent",
    ],
    answer: 1,
    explain: "可預測流程沒必要付出 Planner 額外成本。",
    en: {
      q: "For a fixed, predictable process, what should you usually prefer?",
      choices: [
        "Multi-agent debate",
        "A deterministic workflow or state machine",
        "An infinite ReAct loop",
        "A planner agent",
      ],
      explain:
        "Predictable processes rarely justify the extra cost of a planner.",
    },
    topic: "planning",
  },
  {
    q: "每個 sequential step 成功率 95%，10 步都成功約多少？",
    choices: ["95%", "90%", "60%", "10%"],
    answer: 2,
    explain: "0.95^10 ≈ 59.9%。",
    en: {
      q: "If each sequential step succeeds 95% of the time, what is the approximate probability that all 10 succeed?",
      choices: ["95%", "90%", "60%", "10%"],
      explain: "Assuming independent steps, 0.95^10 ≈ 59.9%.",
    },
    topic: "reliability",
  },
  {
    q: "三個獨立 API 為 500/800/600ms，平行執行理論 latency 約？",
    choices: ["1900ms", "800ms", "600ms", "500ms"],
    answer: 1,
    explain: "平行執行主要由最慢的一個決定。",
    en: {
      q: "Three independent APIs take 500 / 800 / 600 ms. What is their theoretical parallel latency?",
      choices: ["1,900 ms", "800 ms", "600 ms", "500 ms"],
      explain: "Parallel execution is mainly limited by the slowest call.",
    },
    topic: "performance",
  },
  {
    q: "Tool API timeout 最合理的策略是？",
    choices: [
      "無限 retry",
      "Exponential Backoff + Circuit Breaker + Fallback",
      "完全不 retry",
      "重新訓練 LLM",
    ],
    answer: 1,
    explain: "重試要有限制並避免故障擴散。",
    en: {
      q: "What is a sensible strategy for a tool API timeout?",
      choices: [
        "Retry forever",
        "Exponential backoff + circuit breaker + fallback",
        "Never retry",
        "Retrain the LLM",
      ],
      explain: "Bound retries to avoid cascading failures.",
    },
    topic: "reliability",
  },
  {
    q: "Coding Agent 的 Harness 是？",
    choices: [
      "System Prompt",
      "模型外圍負責 tool、filesystem、terminal、permission、loop 的執行層",
      "Vector DB",
      "GPU Kernel",
    ],
    answer: 1,
    explain: "模型做 decision，Harness 管 execution。",
    en: {
      q: "What is a coding agent harness?",
      choices: [
        "The system prompt",
        "The execution layer around the model that manages tools, filesystem, terminal, permissions, and the loop",
        "A vector database",
        "A GPU kernel",
      ],
      explain: "The model makes decisions; the harness manages execution.",
    },
    topic: "harness",
  },
  {
    q: "為什麼不建議 execute_shell(anything)？",
    choices: [
      "shell 太慢",
      "攻擊面大，應用 capability-based tools",
      "shell 不支援 JSON",
      "Agent 不能產文字",
    ],
    answer: 1,
    explain: "明確能力介面更容易做 permission、audit、sandbox。",
    en: {
      q: "Why avoid execute_shell(anything)?",
      choices: [
        "The shell is too slow",
        "It creates a large attack surface; prefer capability-based tools",
        "The shell does not support JSON",
        "Agents cannot generate text",
      ],
      explain:
        "Explicit capability interfaces make permissions, auditing, and sandboxing easier.",
    },
    topic: "harness",
  },
  {
    q: "為什麼 Agent Evaluation 不能只看 final answer？",
    choices: [
      "還要看 tool selection、parameters、latency、cost、safety",
      "final answer 不重要",
      "只能看 token",
      "只能人工測",
    ],
    answer: 0,
    explain: "Production evaluation 要拆 end-to-end 與各子能力指標。",
    en: {
      q: "Why should agent evaluation go beyond the final answer?",
      choices: [
        "It must also assess tool selection, parameters, latency, cost, and safety",
        "The final answer does not matter",
        "Only tokens matter",
        "Only manual testing is possible",
      ],
      explain:
        "Production evaluation covers both end-to-end outcomes and individual capabilities.",
    },
    topic: "evaluation",
  },
];
