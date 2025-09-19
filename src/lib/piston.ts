// Piston API integration for reliable code execution
import axios from 'axios';

export interface PistonSubmission {
  language: string;
  version?: string;
  files: Array<{
    name?: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface PistonResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

// Piston API Configuration
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

// Language mapping for Piston API (exact names as supported by Piston)
export const PistonLanguages = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'c++',
  c: 'c',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  typescript: 'typescript',
  php: 'php',
  ruby: 'ruby',
  kotlin: 'kotlin',
  swift: 'swift',
  r: 'r',
  scala: 'scala',
  perl: 'perl',
  lua: 'lua',
  bash: 'bash',
  powershell: 'powershell'
} as const;

// Execute code using Piston API
export async function executeCodeWithPiston(submission: PistonSubmission): Promise<PistonResult> {
  try {
    const response = await axios.post(`${PISTON_API_URL}/execute`, submission, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Piston execution error:', error);
    
    // Try alternative language names for common failures
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const alternativeNames: Record<string, string[]> = {
        'c++': ['cpp', 'g++'],
        'cpp': ['c++', 'g++'],
        'typescript': ['javascript', 'node'],
        'rust': ['rustc'],
        'c': ['gcc']
      };
      
      const alternatives = alternativeNames[submission.language];
      if (alternatives) {
        for (const altName of alternatives) {
          try {
            console.log(`Trying alternative language name: ${altName}`);
            const altSubmission = { ...submission, language: altName };
            const response = await axios.post(`${PISTON_API_URL}/execute`, altSubmission, {
              timeout: 30000,
              headers: { 'Content-Type': 'application/json' },
            });
            return response.data;
          } catch (altError) {
            console.log(`Alternative ${altName} also failed`);
          }
        }
      }
    }
    
    // Return error result
    return {
      language: submission.language,
      version: 'unknown',
      run: {
        stdout: '',
        stderr: `Error executing code: ${(error as Error)?.message || 'Unknown error'}\n\nThis might be due to:\n• Language not supported by Piston API\n• Network connectivity issues\n• Invalid code syntax`,
        code: 1,
        signal: null,
        output: `Error executing code: ${(error as Error)?.message || 'Unknown error'}`
      }
    };
  }
}

// Simplified function for running code
export async function runCodeWithPiston(
  language: keyof typeof PistonLanguages,
  sourceCode: string,
  input?: string
): Promise<PistonResult> {
  const pistonLanguage = PistonLanguages[language];
  
  if (!pistonLanguage) {
    throw new Error(`Language ${language} is not supported`);
  }

  // Determine the appropriate filename based on language
  const getFileName = (lang: string): string => {
    const extensions: Record<string, string> = {
      'javascript': 'main.js',
      'python': 'main.py',
      'java': 'Main.java',
      'c++': 'main.cpp',        // Updated to match language name
      'c': 'main.c',
      'csharp': 'Main.cs',      // Capital M for C# Main class
      'go': 'main.go',
      'rust': 'main.rs',
      'typescript': 'main.ts',
      'php': 'main.php',
      'ruby': 'main.rb',
      'kotlin': 'main.kt',
      'swift': 'main.swift',
      'r': 'main.r',
      'scala': 'main.scala',
      'perl': 'main.pl',
      'lua': 'main.lua',
      'bash': 'main.sh',
      'powershell': 'main.ps1'
    };
    return extensions[lang] || 'main.txt';
  };

  return executeCodeWithPiston({
    language: pistonLanguage,
    version: '*', // Use latest version
    files: [
      {
        name: getFileName(pistonLanguage),
        content: sourceCode,
      },
    ],
    stdin: input || '',
    compile_timeout: 10000, // 10 seconds
    run_timeout: 3000,      // 3 seconds
    compile_memory_limit: -1,
    run_memory_limit: -1,
  });
}

// Get available languages from Piston API
export async function getAvailableLanguages(): Promise<Array<{language: string, version: string, aliases: string[]}>> {
  try {
    const response = await axios.get(`${PISTON_API_URL}/runtimes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available languages:', error);
    return [];
  }
}

// Language-specific code templates for Piston
export const getPistonCodeTemplate = (language: keyof typeof PistonLanguages, topicTitle: string = 'Topic') => {
  const templates = {
    javascript: `// JavaScript - ${topicTitle}
console.log("Hello from JavaScript!");

// Example: Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Example: Function
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log("Fibonacci(7):", fibonacci(7));`,

    python: `# Python - ${topicTitle}
print("Hello from Python!")

# Example: List operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Original:", numbers)
print("Doubled:", doubled)

# Example: Function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci(7):", fibonacci(7))`,

    java: `// Java - ${topicTitle}
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        // Example: Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Original: ");
        System.out.println(Arrays.toString(numbers));
        
        // Example: ArrayList
        ArrayList<Integer> doubled = new ArrayList<>();
        for (int num : numbers) {
            doubled.add(num * 2);
        }
        System.out.println("Doubled: " + doubled);
        
        // Example: Function
        System.out.println("Fibonacci(7): " + fibonacci(7));
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,

    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Original: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    vector<int> doubled;
    for (int num : numbers) {
        doubled.push_back(num * 2);
    }
    cout << "Doubled: ";
    for (int num : doubled) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}`,

    c: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    
    int numbers[] = {1, 2, 3, 4, 5};
    int size = 5;
    
    printf("Original: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    printf("Doubled: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i] * 2);
    }
    printf("\\n");
    
    return 0;
}`,

    csharp: `// C# - ${topicTitle}
using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        
        // Example: Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        Console.WriteLine("Original: [" + string.Join(", ", numbers) + "]");
        
        var doubled = numbers.Select(n => n * 2).ToArray();
        Console.WriteLine("Doubled: [" + string.Join(", ", doubled) + "]");
        
        // Example: Function
        Console.WriteLine("Fibonacci(7): " + Fibonacci(7));
    }
    
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }
}`,

    go: `// Go - ${topicTitle}
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Hello from Go!")
    
    // Example: Slice operations
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Printf("Original: %v\\n", numbers)
    
    var doubled []int
    for _, num := range numbers {
        doubled = append(doubled, num*2)
    }
    fmt.Printf("Doubled: %v\\n", doubled)
    
    // Example: Function
    fmt.Printf("Fibonacci(7): %d\\n", fibonacci(7))
}`,

    rust: `fn main() {
    println!("Hello from Rust!");
    
    let numbers = vec![1, 2, 3, 4, 5];
    println!("Original: {:?}", numbers);
    
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
}`,

    typescript: `console.log("Hello from TypeScript!");

const numbers: number[] = [1, 2, 3, 4, 5];
const doubled = numbers.map((n: number) => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);`,

    php: `<?php
// PHP - ${topicTitle}
echo "Hello from PHP!\\n";

// Example: Array operations
$numbers = [1, 2, 3, 4, 5];
echo "Original: " . implode(", ", $numbers) . "\\n";

$doubled = array_map(function($n) { return $n * 2; }, $numbers);
echo "Doubled: " . implode(", ", $doubled) . "\\n";

// Example: Function
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo "Fibonacci(7): " . fibonacci(7) . "\\n";
?>`,

    ruby: `# Ruby - ${topicTitle}
puts "Hello from Ruby!"

# Example: Array operations
numbers = [1, 2, 3, 4, 5]
puts "Original: #{numbers}"

doubled = numbers.map { |n| n * 2 }
puts "Doubled: #{doubled}"

# Example: Function
def fibonacci(n)
  return n if n <= 1
  fibonacci(n - 1) + fibonacci(n - 2)
end

puts "Fibonacci(7): #{fibonacci(7)}"`,

    kotlin: `// Kotlin - ${topicTitle}
fun fibonacci(n: Int): Int {
    return if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
}

fun main() {
    println("Hello from Kotlin!")
    
    // Example: List operations
    val numbers = listOf(1, 2, 3, 4, 5)
    println("Original: $numbers")
    
    val doubled = numbers.map { it * 2 }
    println("Doubled: $doubled")
    
    // Example: Function
    println("Fibonacci(7): \${fibonacci(7)}")
}`,

    swift: `// Swift - ${topicTitle}
func fibonacci(_ n: Int) -> Int {
    if n <= 1 { return n }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print("Hello from Swift!")

// Example: Array operations
let numbers = [1, 2, 3, 4, 5]
print("Original: \\(numbers)")

let doubled = numbers.map { $0 * 2 }
print("Doubled: \\(doubled)")

// Example: Function
print("Fibonacci(7): \\(fibonacci(7))")`,

    r: `# R - ${topicTitle}
print("Hello from R!")

# Example: Vector operations
numbers <- c(1, 2, 3, 4, 5)
print(paste("Original:", paste(numbers, collapse=", ")))

doubled <- numbers * 2
print(paste("Doubled:", paste(doubled, collapse=", ")))

# Example: Function
fibonacci <- function(n) {
  if (n <= 1) return(n)
  return(fibonacci(n - 1) + fibonacci(n - 2))
}

print(paste("Fibonacci(7):", fibonacci(7)))`,

    scala: `// Scala - ${topicTitle}
object Main extends App {
  def fibonacci(n: Int): Int = {
    if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
  }
  
  println("Hello from Scala!")
  
  // Example: List operations
  val numbers = List(1, 2, 3, 4, 5)
  println(s"Original: $numbers")
  
  val doubled = numbers.map(_ * 2)
  println(s"Doubled: $doubled")
  
  // Example: Function
  println(s"Fibonacci(7): \${fibonacci(7)}")
}`,

    perl: `# Perl - ${topicTitle}
print "Hello from Perl!\\n";

# Example: Array operations
my @numbers = (1, 2, 3, 4, 5);
print "Original: " . join(", ", @numbers) . "\\n";

my @doubled = map { $_ * 2 } @numbers;
print "Doubled: " . join(", ", @doubled) . "\\n";

# Example: Function
sub fibonacci {
    my $n = shift;
    return $n if $n <= 1;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

print "Fibonacci(7): " . fibonacci(7) . "\\n";`,

    lua: `-- Lua - ${topicTitle}
print("Hello from Lua!")

-- Example: Table operations
local numbers = {1, 2, 3, 4, 5}
print("Original: " .. table.concat(numbers, ", "))

local doubled = {}
for i, v in ipairs(numbers) do
    doubled[i] = v * 2
end
print("Doubled: " .. table.concat(doubled, ", "))

-- Example: Function
function fibonacci(n)
    if n <= 1 then return n end
    return fibonacci(n - 1) + fibonacci(n - 2)
end

print("Fibonacci(7): " .. fibonacci(7))`,

    bash: `#!/bin/bash
# Bash - ${topicTitle}
echo "Hello from Bash!"

# Example: Array operations
numbers=(1 2 3 4 5)
echo "Original: \${numbers[@]}"

doubled=()
for num in "\${numbers[@]}"; do
    doubled+=($((num * 2)))
done
echo "Doubled: \${doubled[@]}"

# Example: Function
fibonacci() {
    local n=$1
    if [ $n -le 1 ]; then
        echo $n
    else
        echo $(($(fibonacci $((n - 1))) + $(fibonacci $((n - 2)))))
    fi
}

echo "Fibonacci(7): $(fibonacci 7)"`,

    powershell: `# PowerShell - ${topicTitle}
Write-Host "Hello from PowerShell!"

# Example: Array operations
$numbers = @(1, 2, 3, 4, 5)
Write-Host "Original: $($numbers -join ', ')"

$doubled = $numbers | ForEach-Object { $_ * 2 }
Write-Host "Doubled: $($doubled -join ', ')"

# Example: Function
function Get-Fibonacci {
    param([int]$n)
    if ($n -le 1) { return $n }
    return (Get-Fibonacci ($n - 1)) + (Get-Fibonacci ($n - 2))
}

Write-Host "Fibonacci(7): $(Get-Fibonacci 7)"`
  };

  return templates[language] || templates.javascript;
};

// Test if Piston API is available
export async function testPistonConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${PISTON_API_URL}/runtimes`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Piston API connection test failed:', error);
    return false;
  }
}
