export interface Language {
  id: string;
  name: string;
  extension: string;
  pistonLanguage: string;
  defaultCode: string;
  supportsInput: boolean;
  icon: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    pistonLanguage: 'python',
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
    pistonLanguage: 'javascript',
    defaultCode: `// JavaScript Code
console.log("Hello, World!");

// Simple example
const name = "World";
console.log(\`Hello, \${name}!\`);`,
    supportsInput: false,
    icon: '🟨'
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    pistonLanguage: 'java',
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
    pistonLanguage: 'cpp',
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
    pistonLanguage: 'c',
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
    pistonLanguage: 'csharp',
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
    pistonLanguage: 'go',
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
    pistonLanguage: 'rust',
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
    pistonLanguage: 'php',
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
    pistonLanguage: 'ruby',
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
    pistonLanguage: 'sql',
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