
import React from "react";
import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container px-4 mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Web Wizard AI Assistant
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Your AI buddy for web development, Laravel/PHP expertise, and bulk code editing
          </p>
        </header>
        
        <main>
          <AIAssistant />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by DeepSeek and other AI technologies</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
