
export interface AiModel {
  id: string;
  name: string;
  provider: string;
  specialization?: string;
}

export interface AiResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface CodeAnalysisResult {
  suggestions: string[];
  improvements: string[];
  bugs: string[];
  explanation: string;
}

export interface PhpAnalysisResult extends CodeAnalysisResult {
  securityIssues: string[];
  performanceIssues: string[];
  bestPractices: string[];
}

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  framework?: string;
  specifications?: string[];
  model: string;
}

export interface BulkEditRequest {
  files: {
    path: string;
    content: string;
  }[];
  instructions: string;
  model: string;
}
