
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
// import Split from "react-split";
import { AiModel } from "@/types/ai";
import ChatInterface, { ChatMessage } from "./ChatInterface";
import CodeEditor from "./CodeEditor";
import WebPreview from "./WebPreview";
import { chatWithAi, generateCode, analyzeCode, bulkEditCode, hasApiKey, setApiKey, getApiKey } from "@/services/aiService";
import { ExternalLink, Code, FileText, Search, Wrench, Terminal, Settings, AlertTriangle } from "lucide-react";

const AIAssistant = () => {
  // State for API key
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isKeySet, setIsKeySet] = useState<boolean>(false);
  
  // State for AI models
  const [models, setModels] = useState<AiModel[]>([
    { id: "deepseek-coder", name: "DeepSeek Coder", provider: "DeepSeek", specialization: "Code" },
    { id: "deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek" },
    { id: "other-php", name: "PHP Expert", provider: "AI Provider", specialization: "PHP/Laravel" },
    { id: "other-frontend", name: "Frontend Expert", provider: "AI Provider", specialization: "HTML/CSS/JS" }
  ]);
  const [selectedModel, setSelectedModel] = useState<string>("deepseek-coder");
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Code editor state
  const [htmlCode, setHtmlCode] = useState<string>('<div class="container">\n  <h1>Hello, Web!</h1>\n  <p>This is a preview of your HTML code.</p>\n</div>');
  const [cssCode, setCssCode] = useState<string>('.container {\n  font-family: Arial, sans-serif;\n  max-width: 800px;\n  margin: 0 auto;\n  padding: 20px;\n  text-align: center;\n}\n\nh1 {\n  color: #3b82f6;\n}\n\np {\n  color: #4b5563;\n}');
  const [jsCode, setJsCode] = useState<string>("// JavaScript code will run in the preview\nconsole.log('Preview loaded!');\n\n// Example: Add event listener\ndocument.addEventListener('DOMContentLoaded', () => {\n  const heading = document.querySelector('h1');\n  if (heading) {\n    heading.addEventListener('click', () => {\n      heading.style.color = '#ef4444';\n    });\n  }\n});");
  const [phpCode, setPhpCode] = useState<string>("<?php\n\n// Example PHP function\nfunction greeting($name) {\n    return \"Hello, {$name}!\";\n}\n\n// Using Laravel-style controller\nclass UserController extends Controller\n{\n    public function index()\n    {\n        $users = User::all();\n        return view('users.index', compact('users'));\n    }\n\n    public function show($id)\n    {\n        $user = User::findOrFail($id);\n        return view('users.show', compact('user'));\n    }\n}\n");
  
  // Bulk edit state
  const [bulkFiles, setBulkFiles] = useState<{path: string, content: string}[]>([
    { path: 'index.php', content: '<?php echo "Hello World!"; ?>' },
    { path: 'styles.css', content: 'body { font-family: Arial; }' }
  ]);
  const [bulkInstructions, setBulkInstructions] = useState<string>("");
  
  useEffect(() => {
    // Check if API key is set in localStorage
    const storedKeyExists = hasApiKey();
    setIsKeySet(storedKeyExists);
    
    // Initialize with a welcome message
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: "👋 Welcome to Web Wizard AI! I'm your AI assistant for website editing, code operations, and development help, specializing in Laravel, PHP, and frontend technologies. What would you like help with today?",
        timestamp: new Date()
      }
    ]);
  }, []);
  
  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsProcessing(true);
    
    try {
      const response = await chatWithAi(message, selectedModel);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateCode = async (language: string) => {
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    if (!lastUserMessage) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let generatedCode = await generateCode(lastUserMessage.content, language, "", selectedModel);
      
      // Extract code from markdown if present
      const codeRegex = /```(?:html|css|js|javascript|php)?\n([\s\S]*?)```/;
      const match = generatedCode.match(codeRegex);
      if (match && match[1]) {
        generatedCode = match[1];
      }
      
      switch (language) {
        case "html":
          setHtmlCode(generatedCode);
          break;
        case "css":
          setCssCode(generatedCode);
          break;
        case "javascript":
          setJsCode(generatedCode);
          break;
        case "php":
          setPhpCode(generatedCode);
          break;
      }
      
      // Add confirmation message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've generated ${language.toUpperCase()} code based on your request and updated the editor.`,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Sorry, I encountered an error generating ${language} code. Please try again.`,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleAnalyzeCode = async (language: string) => {
    let codeToAnalyze = "";
    
    switch (language) {
      case "html":
        codeToAnalyze = htmlCode;
        break;
      case "css":
        codeToAnalyze = cssCode;
        break;
      case "javascript":
        codeToAnalyze = jsCode;
        break;
      case "php":
        codeToAnalyze = phpCode;
        break;
    }
    
    if (!codeToAnalyze.trim()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeCode(codeToAnalyze, language, selectedModel);
      
      // Format analysis as markdown
      let analysisMessage = `## Code Analysis for ${language.toUpperCase()}\n\n`;
      
      if (analysis.explanation) {
        analysisMessage += `### Overview\n${analysis.explanation}\n\n`;
      }
      
      if (analysis.suggestions.length > 0) {
        analysisMessage += "### Suggestions\n";
        analysis.suggestions.forEach(suggestion => {
          analysisMessage += `- ${suggestion}\n`;
        });
        analysisMessage += "\n";
      }
      
      if (analysis.improvements.length > 0) {
        analysisMessage += "### Improvements\n";
        analysis.improvements.forEach(improvement => {
          analysisMessage += `- ${improvement}\n`;
        });
        analysisMessage += "\n";
      }
      
      if (analysis.bugs.length > 0) {
        analysisMessage += "### Potential Issues\n";
        analysis.bugs.forEach(bug => {
          analysisMessage += `- ${bug}\n`;
        });
        analysisMessage += "\n";
      }
      
      // Add PHP-specific analysis if available
      if ('securityIssues' in analysis) {
        const phpAnalysis = analysis as any;
        
        if (phpAnalysis.securityIssues.length > 0) {
          analysisMessage += "### Security Issues\n";
          phpAnalysis.securityIssues.forEach((issue: string) => {
            analysisMessage += `- ${issue}\n`;
          });
          analysisMessage += "\n";
        }
        
        if (phpAnalysis.performanceIssues.length > 0) {
          analysisMessage += "### Performance Considerations\n";
          phpAnalysis.performanceIssues.forEach((issue: string) => {
            analysisMessage += `- ${issue}\n`;
          });
          analysisMessage += "\n";
        }
        
        if (phpAnalysis.bestPractices.length > 0) {
          analysisMessage += "### Best Practices\n";
          phpAnalysis.bestPractices.forEach((practice: string) => {
            analysisMessage += `- ${practice}\n`;
          });
        }
      }
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: analysisMessage,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Sorry, I encountered an error analyzing your ${language} code. Please try again.`,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkEdit = async () => {
    if (!bulkInstructions.trim() || bulkFiles.length === 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await bulkEditCode(bulkFiles, bulkInstructions, selectedModel);
      
      // Update bulk files with edited content
      setBulkFiles(result.map(file => ({
        path: file.path,
        content: file.content
      })));
      
      // Create a message detailing the changes
      let changesMessage = `## Bulk Edit Results\n\n`;
      changesMessage += `I've applied your instructions to ${result.length} file(s):\n\n`;
      
      result.forEach(file => {
        changesMessage += `### ${file.path}\n`;
        changesMessage += `Changes made:\n`;
        file.changes.forEach(change => {
          changesMessage += `- ${change}\n`;
        });
        changesMessage += "\n";
      });
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: changesMessage,
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error performing bulk edits. Please try again.",
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setIsKeySet(true);
      
      // Add confirmation message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "✅ API key saved successfully! You can now use all features of the AI assistant.",
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {!isKeySet && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              AI API Key Required
            </CardTitle>
            <CardDescription>
              Please enter your AI API key to enable all features. This is stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveApiKey}>Save Key</Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Don't have an API key? This demo will work with any text as a simulated key.
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Web Wizard AI</CardTitle>
              <CardDescription>
                Your AI assistant for website development
              </CardDescription>
              
              <div className="mt-2">
                <Label htmlFor="model-select">AI Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <span className="text-xs text-gray-500">({model.provider})</span>
                          {model.specialization && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              {model.specialization}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="h-[calc(100%-130px)]">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                placeholder="Ask about code, website editing, Laravel, PHP..."
              />
              
              <div className="mt-4 grid grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGenerateCode("html")}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  HTML
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGenerateCode("css")}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  CSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGenerateCode("javascript")}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  JS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGenerateCode("php")}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PHP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Tabs defaultValue="editor">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="editor" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="flex items-center gap-1">
                    <Terminal className="h-4 w-4" />
                    Bulk Edit
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="editor">
                <TabsContent value="editor" className="mt-0">
                  <Tabs defaultValue="html">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="js">JavaScript</TabsTrigger>
                      <TabsTrigger value="php">PHP/Laravel</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="html" className="mt-4">
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAnalyzeCode("html")}
                          disabled={isProcessing}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                      <CodeEditor
                        code={htmlCode}
                        language="html"
                        onChange={setHtmlCode}
                      />
                    </TabsContent>
                    
                    <TabsContent value="css" className="mt-4">
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAnalyzeCode("css")}
                          disabled={isProcessing}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                      <CodeEditor
                        code={cssCode}
                        language="css"
                        onChange={setCssCode}
                      />
                    </TabsContent>
                    
                    <TabsContent value="js" className="mt-4">
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAnalyzeCode("javascript")}
                          disabled={isProcessing}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                      <CodeEditor
                        code={jsCode}
                        language="javascript"
                        onChange={setJsCode}
                      />
                    </TabsContent>
                    
                    <TabsContent value="php" className="mt-4">
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAnalyzeCode("php")}
                          disabled={isProcessing}
                        >
                          <Search className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                      <CodeEditor
                        code={phpCode}
                        language="php"
                        onChange={setPhpCode}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="h-[600px]">
                    <WebPreview 
                      html={htmlCode} 
                      css={cssCode} 
                      js={jsCode} 
                      isLoading={isProcessing} 
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="bulk" className="mt-0">
                  <div className="mb-4">
                    <Label htmlFor="bulk-instructions">Edit Instructions</Label>
                    <Textarea 
                      id="bulk-instructions"
                      placeholder="Describe what changes to make across all files..."
                      value={bulkInstructions}
                      onChange={(e) => setBulkInstructions(e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                  
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleBulkEdit}
                      disabled={isProcessing || !bulkInstructions.trim()}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Apply Bulk Edit
                    </Button>
                  </div>
                  
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Files</h3>
                    <Button variant="ghost" size="sm" onClick={() => setBulkFiles([...bulkFiles, { path: `file${bulkFiles.length + 1}.txt`, content: '' }])}>
                      Add File
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {bulkFiles.map((file, index) => (
                      <div key={index} className="border rounded-md p-2">
                        <div className="flex items-center justify-between mb-2">
                          <Input
                            value={file.path}
                            onChange={(e) => {
                              const newFiles = [...bulkFiles];
                              newFiles[index].path = e.target.value;
                              setBulkFiles(newFiles);
                            }}
                            className="w-full"
                            placeholder="File path"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const newFiles = bulkFiles.filter((_, i) => i !== index);
                              setBulkFiles(newFiles);
                            }}
                            className="ml-2"
                          >
                            Remove
                          </Button>
                        </div>
                        <Textarea
                          value={file.content}
                          onChange={(e) => {
                            const newFiles = [...bulkFiles];
                            newFiles[index].content = e.target.value;
                            setBulkFiles(newFiles);
                          }}
                          className="min-h-[100px] font-mono text-sm"
                          placeholder="File content"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
