import { selectBestModel, getModelInfo } from './src/lib/ai';

// Test cases for model selection
const testCases = [
  // Coding tasks
  { query: "Write a function to sort an array", expected: "gpt-4.1" },
  { query: "Debug this Python code", expected: "gpt-4.1" },
  { query: "Help me implement a binary tree", expected: "gpt-4.1" },
  
  // Mathematics and reasoning
  { query: "Solve this calculus problem", expected: "o3" },
  { query: "Prove this mathematical theorem", expected: "o3" },
  { query: "Competitive programming challenge", expected: "o3" },
  
  // Research and complex analysis
  { query: "Research legal implications of AI", expected: "o3-pro" },
  { query: "Strategic analysis of market trends", expected: "o3-pro" },
  { query: "Scientific research methodology", expected: "o3-pro" },
  
  // Everyday tasks
  { query: "Summarize this document", expected: "gpt-4.1-mini" },
  { query: "Write an email", expected: "gpt-4.1-mini" },
  { query: "How to bake a cake?", expected: "gpt-4.1-mini" },
  
  // Visual and rapid tasks
  { query: "Quick visual analysis needed", expected: "o4-mini" },
  { query: "Extract data from document fast", expected: "o4-mini" },
  { query: "Rapid coding assistance", expected: "o4-mini" },
  
  // Multimodal
  { query: "Translate this audio message", expected: "gpt-4o" },
  { query: "Analyze this image", expected: "gpt-4o" },
  { query: "Voice assistant help", expected: "gpt-4o" },
  
  // Classification
  { query: "Classify this text", expected: "gpt-4.1-nano" },
  { query: "Tag this content", expected: "gpt-4.1-nano" },
];

console.log("🧪 Testing GPT Model Selection Logic\n");

testCases.forEach(({ query, expected }, index) => {
  const selected = selectBestModel(query);
  const status = selected === expected ? "✅" : "❌";
  const modelInfo = getModelInfo(selected);
  
  console.log(`${status} Test ${index + 1}:`);
  console.log(`   Query: "${query}"`);
  console.log(`   Expected: ${expected}`);
  console.log(`   Selected: ${selected} (${modelInfo.name})`);
  console.log(`   Cost Level: ${modelInfo.costLevel}`);
  console.log("");
});

// Additional info
console.log("📊 Model Information Summary:");
const models = ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-4o", "o1", "o3", "o3-pro", "o4-mini"];
models.forEach(model => {
  const info = getModelInfo(model as any);
  console.log(`• ${info.name}: ${info.description} (${info.costLevel} cost)`);
});

export {};
