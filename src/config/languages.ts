export interface Language {
  id: string;
  name: string;
  extension: string;
  monacoLanguage: string;
  defaultCode: string;
  runCommand: string;
  compileCommand?: string;
  dockerImage: string;
  supportsInput: boolean;
  icon: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    monacoLanguage: 'python',
    defaultCode: `# Python Code
def main():
    print("Hello, World!")
    name = input("Enter your name: ")
    print(f"Hello, {name}!")

if __name__ == "__main__":
    main()`,
    runCommand: 'python main.py',
    dockerImage: 'python:3.11-alpine',
    supportsInput: true,
    icon: '🐍'
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    extension: '.js',
    monacoLanguage: 'javascript',
    defaultCode: `// JavaScript Code
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Hello, World!");

rl.question('Enter your name: ', (name) => {
  console.log(\`Hello, \${name}!\`);
  rl.close();
});`,
    runCommand: 'node main.js',
    dockerImage: 'node:18-alpine',
    supportsInput: true,
    icon: '🟨'
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    monacoLanguage: 'java',
    defaultCode: `// Java Code
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}`,
    compileCommand: 'javac Main.java',
    runCommand: 'java Main',
    dockerImage: 'openjdk:17-alpine',
    supportsInput: true,
    icon: '☕'
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    monacoLanguage: 'cpp',
    defaultCode: `// C++ Code
#include <iostream>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    std::string name;
    std::cout << "Enter your name: ";
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!" << std::endl;
    
    return 0;
}`,
    compileCommand: 'g++ -o main main.cpp',
    runCommand: './main',
    dockerImage: 'gcc:latest',
    supportsInput: true,
    icon: '⚡'
  },
  {
    id: 'c',
    name: 'C',
    extension: '.c',
    monacoLanguage: 'c',
    defaultCode: `// C Code
#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");
    
    char name[100];
    printf("Enter your name: ");
    fgets(name, sizeof(name), stdin);
    
    // Remove newline character
    name[strcspn(name, "\\n")] = 0;
    
    printf("Hello, %s!\\n", name);
    
    return 0;
}`,
    compileCommand: 'gcc -o main main.c',
    runCommand: './main',
    dockerImage: 'gcc:latest',
    supportsInput: true,
    icon: '🔧'
  },
  {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    monacoLanguage: 'csharp',
    defaultCode: `// C# Code
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        Console.Write("Enter your name: ");
        string name = Console.ReadLine();
        Console.WriteLine($"Hello, {name}!");
    }
}`,
    compileCommand: 'csc Program.cs',
    runCommand: 'mono Program.exe',
    dockerImage: 'mono:latest',
    supportsInput: true,
    icon: '💜'
  },
  {
    id: 'go',
    name: 'Go',
    extension: '.go',
    monacoLanguage: 'go',
    defaultCode: `// Go Code
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    fmt.Println("Hello, World!")
    
    fmt.Print("Enter your name: ")
    scanner := bufio.NewScanner(os.Stdin)
    scanner.Scan()
    name := scanner.Text()
    
    fmt.Printf("Hello, %s!\\n", name)
}`,
    compileCommand: 'go build -o main main.go',
    runCommand: './main',
    dockerImage: 'golang:alpine',
    supportsInput: true,
    icon: '🐹'
  },
  {
    id: 'rust',
    name: 'Rust',
    extension: '.rs',
    monacoLanguage: 'rust',
    defaultCode: `// Rust Code
use std::io;

fn main() {
    println!("Hello, World!");
    
    println!("Enter your name: ");
    let mut name = String::new();
    io::stdin().read_line(&mut name).expect("Failed to read line");
    
    println!("Hello, {}!", name.trim());
}`,
    compileCommand: 'rustc main.rs',
    runCommand: './main',
    dockerImage: 'rust:alpine',
    supportsInput: true,
    icon: '🦀'
  },
  {
    id: 'php',
    name: 'PHP',
    extension: '.php',
    monacoLanguage: 'php',
    defaultCode: `<?php
// PHP Code
echo "Hello, World!\\n";

echo "Enter your name: ";
$name = trim(fgets(STDIN));
echo "Hello, $name!\\n";
?>`,
    runCommand: 'php main.php',
    dockerImage: 'php:8.2-cli-alpine',
    supportsInput: true,
    icon: '🐘'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    extension: '.rb',
    monacoLanguage: 'ruby',
    defaultCode: `# Ruby Code
puts "Hello, World!"

print "Enter your name: "
name = gets.chomp
puts "Hello, #{name}!"`,
    runCommand: 'ruby main.rb',
    dockerImage: 'ruby:alpine',
    supportsInput: true,
    icon: '💎'
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    monacoLanguage: 'sql',
    defaultCode: `-- SQL Code
-- Create a sample table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com');

-- Query the data
SELECT * FROM users;
SELECT name, email FROM users WHERE name LIKE 'A%';`,
    runCommand: 'sqlite3 -header -column database.db < main.sql',
    dockerImage: 'alpine:latest',
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