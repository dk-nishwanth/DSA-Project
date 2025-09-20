# DEPRECATED - Judge0 Integration Removed

This file is deprecated. Judge0 API integration has been removed from the project.

## ✅ Current Solution: Piston API

The project now uses **Piston API** exclusively for code execution:

- **File**: `src/lib/piston.ts`
- **Component**: `src/components/enhanced-code-playground.tsx`
- **No API Keys Required**: Free and reliable
- **12+ Languages Supported**: JavaScript, Python, Java, C++, C, C#, Go, Rust, TypeScript, PHP, Ruby, Kotlin

## 🗑️ Removed Judge0 References

The following Judge0-related code has been removed:

## ⚙️ Configuration

### Option 1: Free Judge0 Instance (Recommended for Development)

No API key required, but has rate limits:

```env
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=
```

### Option 2: RapidAPI Judge0 (Production)

Get your API key from [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce):

```env
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your-rapidapi-key-here
```

### Option 3: Self-hosted Judge0

Run your own Judge0 instance:

```env
VITE_JUDGE0_API_URL=http://localhost:2358
VITE_JUDGE0_API_KEY=
```

## 🛠️ Setup

1. **Install Dependencies**:
   ```bash
   npm install axios
   ```

2. **Configure Environment**:
   ```bash
   # Windows
   .\setup-judge0.bat
   
   # Linux/Mac
   chmod +x setup-judge0.sh
   ./setup-judge0.sh
   ```

3. **Edit Configuration**:
   - Open `.env` file
   - Set your preferred API URL and key
   - Save the file

4. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Test the integration:

```typescript
import { runOnJudge0, Judge0Language } from './src/lib/judge0';

// Test Python
const result = await runOnJudge0({
  languageId: Judge0Language.python,
  source: 'print("Hello World!")'
});
console.log(result);
```

## 📁 File Structure

```
src/lib/
├── judge0.ts          # Main Judge0 API integration
├── code-playground.tsx # UI component for code execution
└── ...

Configuration Files:
├── .env               # Environment variables (auto-created)
├── judge0-config.env  # Configuration template
├── setup-judge0.bat  # Windows setup script
└── setup-judge0.sh   # Linux/Mac setup script
```

## 🔧 API Functions

### `runOnJudge0(params)`
Main function for executing code:

```typescript
const result = await runOnJudge0({
  languageId: Judge0Language.python,
  source: 'print("Hello!")',
  stdin: 'optional input'
});
```

### `executeCode(submission)`
Low-level function for direct API calls:

```typescript
const result = await executeCode({
  source_code: 'print("Hello!")',
  language_id: 71,
  stdin: 'optional input'
});
```

## 🚨 Error Handling

The integration includes comprehensive error handling:

- **API Failures**: Automatic fallback to mock execution
- **Timeout Protection**: 30-second timeout with polling
- **Network Issues**: Graceful degradation
- **Invalid Code**: Proper error messages

## 📊 Performance

- **Polling Interval**: 1 second
- **Max Attempts**: 30 (30 seconds total)
- **Timeout Protection**: Built-in timeout handling
- **Fallback System**: Instant fallback on API failure

## 🔒 Security

- **Sandboxed Execution**: Code runs in isolated environments
- **No File System Access**: Limited system access
- **Resource Limits**: Memory and time constraints
- **Input Validation**: Proper input sanitization

## 🐛 Troubleshooting

### Common Issues:

1. **API Key Issues**:
   - Check your RapidAPI key
   - Verify API key permissions
   - Ensure correct API URL

2. **Rate Limiting**:
   - Free tier has limits
   - Consider upgrading to paid plan
   - Use self-hosted instance

3. **Network Issues**:
   - Check internet connection
   - Verify API endpoint accessibility
   - Check firewall settings

### Debug Mode:

Enable debug logging:

```typescript
// In judge0.ts, uncomment console.log statements
console.log('Judge0 execution error:', error);
```

## 📈 Monitoring

Monitor API usage:

- Check browser console for errors
- Monitor network requests in DevTools
- Track execution times and success rates

## 🎯 Best Practices

1. **Use Environment Variables**: Never hardcode API keys
2. **Handle Errors Gracefully**: Always provide fallbacks
3. **Monitor Rate Limits**: Track API usage
4. **Test Thoroughly**: Test all supported languages
5. **Keep Updated**: Stay current with Judge0 API changes

## 📚 Resources

- [Judge0 Documentation](https://ce.judge0.com/)
- [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
- [Judge0 GitHub](https://github.com/judge0/judge0)
- [Language IDs Reference](https://ce.judge0.com/#statuses-and-languages-languages-get)

---

**Note**: This integration is production-ready and includes comprehensive error handling, fallback systems, and security measures.
