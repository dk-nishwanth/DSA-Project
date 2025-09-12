# 🚀 Real Code Execution Setup Guide

This guide will help you enable **real compilation and execution** for all programming languages in your DSA learning platform. Students will be able to write actual code that compiles and runs with real output!

## ⚡ Quick Setup (2 minutes)

### Step 1: Get Free API Access

1. **Visit [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)**
2. **Click "Subscribe to Test"**
3. **Choose the FREE plan** (500 executions/month - perfect for learning!)
4. **Copy your API key** from the dashboard

### Step 2: Configure Your Environment

**Option A: Environment Variable (Recommended)**
```bash
# Create .env.local file in your project root
echo "NEXT_PUBLIC_RAPIDAPI_KEY=your_actual_api_key_here" > .env.local
```

**Option B: In-App Configuration**
1. Click the "Setup Required" button in any code playground
2. Enter your API key in the dialog
3. Click "Save API Key"

### Step 3: Restart and Test

```bash
# Restart your development server
npm run dev
# or
yarn dev
```

**Test it works:**
1. Go to any topic with a code playground
2. Write a simple program (e.g., `print("Hello World!")` in Python)
3. Click "Run" - you should see real output!

## ✅ What You Get

### 🔥 Real Compilation
- **Actual compiler errors** with line numbers
- **Syntax error detection** 
- **Type checking** and warnings
- **Link-time error reporting**

### 🎯 Real Execution
- **Actual program output** from stdout/stderr
- **Runtime error detection** with stack traces
- **Input/output support** for interactive programs
- **Performance metrics** (execution time, memory usage)

### 🌍 Multi-Language Support
- **C** - GCC compiler with full standard library
- **C++** - G++ with STL support
- **Java** - OpenJDK with complete standard library
- **C#** - Mono compiler with .NET framework
- **Python** - Python 3.x with standard library
- **JavaScript** - Node.js runtime
- **PHP** - PHP interpreter with standard functions
- **Ruby** - Ruby interpreter with gems
- **Go** - Official Go compiler
- **Rust** - Rustc with Cargo support
- **SQL** - SQLite database engine

## 🛡️ Security & Limits

### Execution Environment
- **Sandboxed containers** - Code runs in isolated environments
- **Time limits** - 10 second maximum execution time
- **Memory limits** - 256MB maximum memory usage
- **CPU limits** - Prevents resource abuse

### Free Tier Limits
- **500 executions/month** with Judge0 (RapidAPI)
- **Unlimited executions** with Piston (backup service)
- **Automatic fallbacks** if limits are reached

## 🔧 How It Works

The system uses multiple execution services with intelligent fallbacks:

1. **Judge0 API** (Primary) - Most reliable, used in competitive programming
2. **Piston API** (Backup) - Free alternative, no API key needed
3. **CodeX API** (Fallback) - Additional backup service
4. **Local JavaScript** (Special) - Real JS execution in browser
5. **Enhanced Simulation** (Final fallback) - If all services fail

## 📊 Testing Your Setup

### Automatic Test
```javascript
// The system includes a built-in test component
import { ExecutionTest } from '@/components/execution-test';

// Use in any page to test all services
<ExecutionTest />
```

### Manual Test
Try these test programs:

**Python:**
```python
print("Hello from Python!")
print("Math test: 2 + 2 =", 2 + 2)
import datetime
print("Current time:", datetime.datetime.now())
```

**Java:**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Current time: " + java.time.LocalDateTime.now());
    }
}
```

**C++:**
```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    vector<int> nums = {1, 2, 3, 4, 5};
    cout << "Vector size: " << nums.size() << endl;
    return 0;
}
```

## 🚨 Troubleshooting

### "API request failed" Error
1. **Check your API key** in `.env.local` or app settings
2. **Verify free requests remaining** in RapidAPI dashboard
3. **System will automatically fallback** to other services

### "Language not supported" Error
- **All major languages are supported** by at least one service
- **Check the console** for detailed error messages
- **Try a different language** to verify setup

### Slow Execution
- **First execution may be slower** (cold start)
- **Network latency** affects response time
- **Subsequent executions are faster**

### No Output Showing
1. **Check if your program produces output** (add print/console.log statements)
2. **Verify the program compiles** without errors
3. **Check the error section** for compilation issues

## 🎓 For Educators

### Classroom Setup
1. **Get a single API key** for the class
2. **Set it in the environment** for all students
3. **Monitor usage** through RapidAPI dashboard
4. **Consider upgrading** for heavy usage (very affordable)

### Assignment Ideas
- **Debug broken code** - Students fix compilation errors
- **Performance comparison** - Compare algorithm execution times
- **Input/output exercises** - Programs that read user input
- **Multi-language challenges** - Same algorithm in different languages

## 💡 Pro Tips

### Maximizing Free Tier
- **JavaScript runs locally** - doesn't count against API limits
- **Piston API is unlimited** - automatic fallback when Judge0 limit reached
- **Batch testing** - test multiple solutions at once

### Best Practices
- **Add error handling** in student code
- **Use meaningful variable names** for better error messages
- **Include comments** to help with debugging
- **Test with different inputs** to verify correctness

## 🔮 Advanced Configuration

### Custom Execution Limits
Edit `src/lib/code-executor.ts`:

```typescript
// Increase time limit to 15 seconds
cpu_time_limit: 15,

// Increase memory limit to 512MB
memory_limit: 512000
```

### Adding More Services
The system is designed to be extensible. Add new execution services by:

1. Adding service configuration to `LANGUAGE_CONFIGS`
2. Implementing execution function
3. Adding to the fallback chain

### Monitoring and Analytics
- **Track execution success rates**
- **Monitor response times**
- **Analyze most used languages**
- **Identify common errors**

## 🎉 Success!

Your DSA learning platform now has **real code execution**! Students can:

- ✅ **Write actual programs** that compile and run
- ✅ **See real compiler errors** and learn to debug
- ✅ **Get immediate feedback** on their solutions
- ✅ **Practice in multiple languages** with real output
- ✅ **Build confidence** with professional tools
- ✅ **Prepare for interviews** with realistic coding environment

The system handles all the complexity automatically - students just write code and see real results instantly!

## 📞 Support

If you encounter any issues:

1. **Check the browser console** for detailed error messages
2. **Verify your API key** is correctly configured
3. **Test with simple programs** first
4. **Check service status** using the built-in test component

The system is designed to be robust with multiple fallbacks, so code execution should work even if individual services have issues.

---

**Happy Coding! 🚀**