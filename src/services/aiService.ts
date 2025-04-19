
import axios from 'axios';
import { AiResponse, CodeAnalysisResult, PhpAnalysisResult } from '@/types/ai';

// This is a simulated service since we don't have actual API keys
// In a real implementation, you would use your DeepSeek API key and proper endpoints

const API_KEY_INPUT_NAME = 'ai-api-key';

export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_INPUT_NAME);
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_INPUT_NAME, apiKey);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_INPUT_NAME);
};

export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

// Simulated AI response for demonstration purposes
const simulateAiResponse = async (prompt: string, model: string): Promise<AiResponse> => {
  // In a real implementation, this would make an API call to DeepSeek or another AI provider
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock specialized responses based on keywords in the prompt
  let content = '';
  
  if (prompt.toLowerCase().includes('laravel')) {
    content = "Laravel is a PHP web application framework with expressive, elegant syntax. Here's how you can solve this:\n\n```php\n<?php\n\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\User;\nuse Illuminate\\Http\\Request;\n\nclass UserController extends Controller\n{\n    public function index()\n    {\n        return User::all();\n    }\n}\n```\n\nMake sure to run your migrations and set up your routes properly.";
  } else if (prompt.toLowerCase().includes('php')) {
    content = "Here's a PHP solution for your problem:\n\n```php\n<?php\n\nfunction processData($data) {\n    $result = [];\n    \n    foreach ($data as $item) {\n        $result[] = $item * 2;\n    }\n    \n    return $result;\n}\n\n$data = [1, 2, 3, 4, 5];\n$processed = processData($data);\nprint_r($processed);\n```";
  } else if (prompt.toLowerCase().includes('css') || prompt.toLowerCase().includes('html')) {
    content = "Here's a responsive solution using modern CSS:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));\n  gap: 1rem;\n}\n\n@media (max-width: 768px) {\n  .container {\n    grid-template-columns: 1fr;\n  }\n}\n```\n\nThis creates a responsive grid layout that adjusts based on the viewport size.";
  } else if (prompt.toLowerCase().includes('javascript') || prompt.toLowerCase().includes('js')) {
    content = "Here's a JavaScript solution:\n\n```javascript\nconst fetchData = async () => {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n    return null;\n  }\n};\n\n// Usage\nfetchData().then(data => {\n  console.log(data);\n});\n```";
  } else {
    content = "I understand you need assistance with website editing and code operations. Could you provide more specific details about what you're trying to accomplish? I can help with HTML, CSS, JavaScript, PHP, Laravel, or other web technologies.";
  }
  
  return {
    content,
    model,
    usage: {
      promptTokens: prompt.length,
      completionTokens: content.length,
      totalTokens: prompt.length + content.length,
    }
  };
};

export const analyzeCode = async (
  code: string, 
  language: string, 
  model: string
): Promise<CodeAnalysisResult | PhpAnalysisResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Base analysis result
  const baseResult: CodeAnalysisResult = {
    suggestions: [
      "Consider adding more descriptive comments",
      "Improve variable naming for better readability"
    ],
    improvements: [
      "Extract repeated logic into separate functions",
      "Add error handling for edge cases"
    ],
    bugs: [],
    explanation: "Your code appears to be functional, but could benefit from some readability improvements."
  };
  
  // Add language-specific analysis
  if (language === 'php' || language === 'php-laravel') {
    return {
      ...baseResult,
      securityIssues: [
        "Potential SQL injection risk - use prepared statements",
        "Validate user input before processing"
      ],
      performanceIssues: [
        "Consider caching repeated database queries",
        "Optimize database indexes for frequently accessed columns"
      ],
      bestPractices: [
        "Follow PSR-12 coding standards",
        "Use dependency injection instead of global state"
      ]
    } as PhpAnalysisResult;
  }
  
  return baseResult;
};

export const generateCode = async (
  prompt: string,
  language: string,
  framework: string = '',
  model: string
): Promise<string> => {
  // This would be a real API call in production
  const response = await simulateAiResponse(
    `Generate ${language} ${framework ? `using ${framework}` : ''} code for: ${prompt}`,
    model
  );
  
  return response.content;
};

export const chatWithAi = async (
  message: string,
  model: string
): Promise<AiResponse> => {
  return simulateAiResponse(message, model);
};

export const bulkEditCode = async (
  files: { path: string; content: string }[],
  instructions: string,
  model: string
): Promise<{ path: string; content: string; changes: string[] }[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would send the files and instructions to an AI API
  // and return the modified files
  
  return files.map(file => {
    // Simple simulation - just add a comment at the top of each file
    const modifiedContent = `/**\n * Modified as per instructions: "${instructions}"\n * Generated by AI assistant\n */\n\n${file.content}`;
    
    return {
      path: file.path,
      content: modifiedContent,
      changes: ["Added documentation header"]
    };
  });
};
