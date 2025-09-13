export interface Language {
  id: string;
  name: string;
  extension: string;
  judge0LanguageId: number;
  defaultCode: string;
  supportsInput: boolean;
  icon: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    judge0LanguageId: 71,
    defaultCode: `# Python Code
def main():
    print("Hello, World!")
    name = input("Enter your name: ")
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()`,
    supportsInput: true,
    icon: '🐍'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    judge0LanguageId: 63,
    defaultCode: `// JavaScript Code
console.log("Hello, World!");

// Simple input simulation
const name = "World"; // In real Judge0, you'd use stdin
console.log(\`Hello, \${name}!\`);`,
    supportsInput: false,
    icon: '🟨'
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    judge0LanguageId: 62,
    defaultCode: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Hello, Java!");
    }
}`,
    supportsInput: false,
    icon: '☕'
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    judge0LanguageId: 54,
    defaultCode: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "Hello, C++!" << endl;
    return 0;
}`,
    supportsInput: false,
    icon: '⚡'
  },
  {
    id: 'c',
    name: 'C',
    extension: '.c',
    judge0LanguageId: 50,
    defaultCode: `// C Code
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Hello, C!\\n");
    return 0;
}`,
    supportsInput: false,
    icon: '🔧'
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    judge0LanguageId: 51,
    defaultCode: `// C# Code
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        Console.WriteLine("Hello, C#!");
    }
}`,
    supportsInput: false,
    icon: '🔷'
  },
  {
    id: 'go',
    name: 'Go',
    extension: '.go',
    judge0LanguageId: 60,
    defaultCode: `// Go Code
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Hello, Go!")
}`,
    supportsInput: false,
    icon: '🐹'
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: '.rs',
    judge0LanguageId: 73,
    defaultCode: `// Rust Code
fn main() {
    println!("Hello, World!");
    println!("Hello, Rust!");
}`,
    supportsInput: false,
    icon: '🦀'
  },
  {
    id: 'php',
    name: 'PHP',
    extension: '.php',
    judge0LanguageId: 68,
    defaultCode: `<?php
// PHP Code
echo "Hello, World!\\n";
echo "Hello, PHP!\\n";
?>`,
    supportsInput: false,
    icon: '🐘'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: '.rb',
    judge0LanguageId: 72,
    defaultCode: `# Ruby Code
puts "Hello, World!"
puts "Hello, Ruby!"`,
    supportsInput: false,
    icon: '💎'
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    judge0LanguageId: 82,
    defaultCode: `-- SQL Code
SELECT 'Hello, World!' as message;
SELECT 'Hello, SQL!' as message;`,
    supportsInput: false,
    icon: '🗄️'
  }
];

export const getLanguageById = (id: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.id === id);
};

export const getDefaultLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0]; // Python as default
};