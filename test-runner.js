const axios = require('axios');

// Your runCode function
const runCode = async (language, code) => {
    console.log(`\n🚀 Testing ${language.toUpperCase()}...`);
    try {
        const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: language,
            version: "*", // latest version
            files: [
                {
                    name: "Main",
                    content: code,
                },
            ],
        });

        const output = res.data.run.output || res.data.run.stderr || "No output";
        console.log(`✅ ${language} executed successfully:`);
        console.log(output);
        return { success: true, output };
    } catch (err) {
        console.log(`❌ ${language} failed:`);
        console.log("Error:", err.message);
        return { success: false, error: err.message };
    }
};

// Test cases for different languages
const testCases = {
    javascript: `
console.log("Hello from JavaScript!");
const arr = [1, 2, 3, 4, 5];
const doubled = arr.map(x => x * 2);
console.log("Doubled array:", doubled);
console.log("Test completed!");
    `,
    
    python: `
print("Hello from Python!")
arr = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in arr]
print("Doubled array:", doubled)
print("Test completed!")
    `,
    
    java: `
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int[] arr = {1, 2, 3, 4, 5};
        int[] doubled = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            doubled[i] = arr[i] * 2;
        }
        System.out.println("Doubled array: " + Arrays.toString(doubled));
        System.out.println("Test completed!");
    }
}
    `,
    
    cpp: `
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    vector<int> arr = {1, 2, 3, 4, 5};
    vector<int> doubled;
    for (int x : arr) {
        doubled.push_back(x * 2);
    }
    cout << "Doubled array: ";
    for (int x : doubled) {
        cout << x << " ";
    }
    cout << endl << "Test completed!" << endl;
    return 0;
}
    `,
    
    c: `
#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);
    printf("Doubled array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i] * 2);
    }
    printf("\\nTest completed!\\n");
    return 0;
}
    `,
    
    go: `
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    arr := []int{1, 2, 3, 4, 5}
    var doubled []int
    for _, x := range arr {
        doubled = append(doubled, x*2)
    }
    fmt.Println("Doubled array:", doubled)
    fmt.Println("Test completed!")
}
    `,
    
    rust: `
fn main() {
    println!("Hello from Rust!");
    let arr = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = arr.iter().map(|x| x * 2).collect();
    println!("Doubled array: {:?}", doubled);
    println!("Test completed!");
}
    `,
    
    typescript: `
console.log("Hello from TypeScript!");
const arr: number[] = [1, 2, 3, 4, 5];
const doubled = arr.map((x: number) => x * 2);
console.log("Doubled array:", doubled);
console.log("Test completed!");
    `
};

// Main test function
async function testAllLanguages() {
    console.log("🧪 Starting Code Runner Test Suite");
    console.log("=" .repeat(50));
    
    const results = {};
    let successCount = 0;
    
    for (const [language, code] of Object.entries(testCases)) {
        const result = await runCode(language, code);
        results[language] = result;
        if (result.success) successCount++;
        
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Summary
    console.log("\n" + "=" .repeat(50));
    console.log("📊 TEST SUMMARY");
    console.log("=" .repeat(50));
    
    const totalTests = Object.keys(testCases).length;
    console.log(`✅ Passed: ${successCount}/${totalTests} languages`);
    console.log(`❌ Failed: ${totalTests - successCount}/${totalTests} languages`);
    
    if (successCount === totalTests) {
        console.log("\n🎉 ALL LANGUAGES WORKING PERFECTLY!");
    } else {
        console.log("\n⚠️  Some languages failed. Check the output above for details.");
    }
    
    console.log("\nDetailed Results:");
    Object.entries(results).forEach(([lang, result]) => {
        const status = result.success ? "✅ PASS" : "❌ FAIL";
        console.log(`  ${lang.padEnd(12)}: ${status}`);
    });
    
    return results;
}

// Test individual language function
async function testLanguage(language) {
    if (!testCases[language]) {
        console.log(`❌ Language '${language}' not supported. Available: ${Object.keys(testCases).join(', ')}`);
        return;
    }
    
    return await runCode(language, testCases[language]);
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Test all languages
        testAllLanguages().catch(console.error);
    } else {
        // Test specific language
        const language = args[0].toLowerCase();
        testLanguage(language).catch(console.error);
    }
}

module.exports = { runCode, testAllLanguages, testLanguage };
