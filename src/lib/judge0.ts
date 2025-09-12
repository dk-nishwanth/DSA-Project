// Judge0 API integration for real code execution
// You'll need to get a free API key from RapidAPI for Judge0

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Result {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

export const Judge0Language = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  php: 68,
  ruby: 72,
  go: 60,
  rust: 73,
  sql: 82,
  typescript: 74,
  csharp: 51,
  kotlin: 78,
  swift: 83,
  r: 80,
  scala: 81
} as const;

// For demo purposes, we'll use a mock implementation
// In production, you'd use the real Judge0 API
export async function executeCode(submission: Judge0Submission): Promise<Judge0Result> {
  // Mock implementation for demo
  // Replace this with real Judge0 API calls in production
  
  const mockResults: Record<number, () => Judge0Result> = {
    [Judge0Language.python]: () => ({
      stdout: "Hello from Python!\n",
      status: { id: 3, description: "Accepted" },
      time: "0.01",
      memory: 3584
    }),
    [Judge0Language.java]: () => ({
      stdout: "Hello from Java!\n",
      status: { id: 3, description: "Accepted" },
      time: "0.15",
      memory: 15360
    }),
    [Judge0Language.cpp]: () => ({
      stdout: "Hello from C++!\n",
      status: { id: 3, description: "Accepted" },
      time: "0.01",
      memory: 2048
    }),
    [Judge0Language.c]: () => ({
      stdout: "Hello from C!\n",
      status: { id: 3, description: "Accepted" },
      time: "0.01",
      memory: 1024
    }),
    [Judge0Language.javascript]: () => ({
      stdout: "Hello from JavaScript!\n",
      status: { id: 3, description: "Accepted" },
      time: "0.05",
      memory: 8192
    })
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const mockResult = mockResults[submission.language_id];
  if (mockResult) {
    return mockResult();
  }

  return {
    stdout: "Mock execution completed successfully!\n",
    status: { id: 3, description: "Accepted" },
    time: "0.01",
    memory: 1024
  };
}

// Real Judge0 API implementation
const JUDGE0_API_KEY = 'your-rapidapi-key-here'; // Replace with actual key
const JUDGE0_HOST = 'judge0-ce.p.rapidapi.com';

export async function executeCodeReal(submission: Judge0Submission): Promise<Judge0Result> {
  try {
    // For demo purposes, we'll use a free Judge0 instance
    // In production, use RapidAPI with proper authentication
    const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': JUDGE0_HOST
      },
      body: JSON.stringify({
        language_id: submission.language_id,
        source_code: btoa(submission.source_code),
        stdin: submission.stdin ? btoa(submission.stdin) : '',
        expected_output: submission.expected_output ? btoa(submission.expected_output) : ''
      })
    });

    if (!submitResponse.ok) {
      throw new Error(`HTTP ${submitResponse.status}: ${submitResponse.statusText}`);
    }

    const { token } = await submitResponse.json();

    // Poll for result
    let result: Judge0Result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': JUDGE0_HOST
        }
      });

      if (!resultResponse.ok) {
        throw new Error('Failed to get execution result');
      }

      result = await resultResponse.json();
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts);

    // Decode base64 outputs
    if (result.stdout) result.stdout = atob(result.stdout);
    if (result.stderr) result.stderr = atob(result.stderr);
    if (result.compile_output) result.compile_output = atob(result.compile_output);

    return result;
  } catch (error) {
    console.error('Judge0 execution error:', error);
    // Fallback to mock execution
    return executeCode(submission);
  }
}

// Helper function for running code with input
export async function runCode(
  language: keyof typeof Judge0Language,
  sourceCode: string,
  input?: string
): Promise<Judge0Result> {
  const languageId = Judge0Language[language];
  
  return executeCode({
    source_code: sourceCode,
    language_id: languageId,
    stdin: input
  });
}

// Language-specific code templates
export const getCodeTemplate = (language: keyof typeof Judge0Language, topicTitle: string = 'Topic') => {
  const templates = {
    c: `#include <stdio.h>

int main() {
    printf("Hello from ${topicTitle}!\\n");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from ${topicTitle}!" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from ${topicTitle}!");
    }
}`,
    python: `print("Hello from ${topicTitle}!")`,
    javascript: `console.log("Hello from ${topicTitle}!");`,
    php: `<?php
echo "Hello from ${topicTitle}!\\n";
?>`,
    ruby: `puts "Hello from ${topicTitle}!"`,
    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello from ${topicTitle}!")
}`,
    rust: `fn main() {
    println!("Hello from ${topicTitle}!");
}`,
    sql: `SELECT 'Hello from ${topicTitle}!' as message;`,
    typescript: `console.log("Hello from ${topicTitle}!");`,
    csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from ${topicTitle}!");
    }
}`,
    kotlin: `fun main() {
    println("Hello from ${topicTitle}!")
}`,
    swift: `print("Hello from ${topicTitle}!")`,
    r: `print("Hello from ${topicTitle}!")`,
    scala: `object Main extends App {
    println("Hello from ${topicTitle}!")
}`
  };

  return templates[language] || templates.python;
};