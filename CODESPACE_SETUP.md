# Personal Codespace Setup Guide

This guide will help you set up the Personal Codespace with Judge0 API-based code execution.

## Prerequisites

1. **Node.js**: Version 16 or higher
2. **npm/yarn**: Package manager
3. **Internet Connection**: For Judge0 API access

## Frontend Setup

1. **Install dependencies**:
```bash
npm install axios lucide-react react-resizable-panels
```

2. **Configure Judge0 API** (optional):
Create `.env` in your project root:
```
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your-rapidapi-key-here
```

3. **Add to your routing**:
```tsx
import { CodespacePage } from './pages/CodespacePage';

// In your router
<Route path="/codespace" element={<CodespacePage />} />
```

## Judge0 API Configuration

The codespace uses Judge0 API for code execution. You have three options:

### Option 1: Free Judge0 Instance (Default)
No API key required, but has rate limits:
```env
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=
```

### Option 2: RapidAPI Judge0 (Recommended for Production)
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

## Supported Languages

The codespace supports the following programming languages:

| Language | Judge0 ID | Status |
|----------|-----------|--------|
| Python   | 71        | ✅     |
| JavaScript | 63     | ✅     |
| Java     | 62        | ✅     |
| C++      | 54        | ✅     |
| C        | 50        | ✅     |
| C#       | 51        | ✅     |
| Go       | 60        | ✅     |
| Rust     | 73        | ✅     |
| PHP      | 68        | ✅     |
| Ruby     | 72        | ✅     |
| SQL      | 82        | ✅     |

## Features

- **Real Code Execution**: Execute code in multiple programming languages
- **Syntax Highlighting**: Basic syntax highlighting for all languages
- **Input Support**: Some languages support stdin input
- **Local Storage**: Code is automatically saved locally
- **Keyboard Shortcuts**: Ctrl+Enter to run, Ctrl+S to save
- **Responsive Design**: Works on desktop and mobile
- **Error Handling**: Comprehensive error handling with fallbacks

## Usage

1. **Start the development server**:
```bash
npm run dev
```

2. **Navigate to codespace**:
Visit `http://localhost:3000/codespace`

3. **Write and execute code**:
   - Select a programming language from the dropdown
   - Write your code in the editor
   - Click "Run" or press Ctrl+Enter to execute
   - View output in the output panel

## Keyboard Shortcuts

- `Ctrl+Enter` or `Cmd+Enter`: Run code
- `Ctrl+S` or `Cmd+S`: Save code locally
- `Ctrl+R` or `Cmd+R`: Reset code to default

## Troubleshooting

### Common Issues:

1. **API Connection Issues**:
   - Check your internet connection
   - Verify Judge0 API URL in .env file
   - Check browser console for errors

2. **Rate Limiting**:
   - Free tier has request limits
   - Consider upgrading to RapidAPI paid plan
   - Use self-hosted Judge0 for unlimited requests

3. **Code Execution Errors**:
   - Check syntax errors in your code
   - Verify language-specific requirements
   - Check output panel for detailed error messages

## Development

### Project Structure:
```
src/
├── components/
│   └── codespace/
│       ├── Codespace.tsx          # Main codespace component
│       ├── LanguageSelector.tsx   # Language selection
│       ├── OutputPanel.tsx        # Output display
│       ├── InputPanel.tsx         # Input handling
│       └── Toolbar.tsx            # Action buttons
├── config/
│   └── languages.ts               # Language configurations
├── lib/
│   └── judge0.ts                  # Judge0 API integration
├── services/
│   └── codeExecutionService.ts    # Code execution service
└── pages/
    └── CodespacePage.tsx          # Codespace page
```

### Adding New Languages:

1. **Update language configuration** in `src/config/languages.ts`:
```typescript
{
  id: 'newlang',
  name: 'New Language',
  extension: '.ext',
  judge0LanguageId: 123, // Get from Judge0 API
  defaultCode: '// Default code template',
  supportsInput: false,
  icon: '🆕'
}
```

2. **Test the language** with Judge0 API to ensure compatibility

## Security

- **Sandboxed Execution**: Code runs in isolated Judge0 environments
- **No File System Access**: Limited system access
- **Resource Limits**: Memory and time constraints
- **Input Validation**: Proper input sanitization

## Performance

- **Polling Interval**: 1 second for result checking
- **Timeout Protection**: 30-second maximum execution time
- **Fallback System**: Automatic fallback on API failure
- **Caching**: Local storage for code persistence

---

**Note**: This codespace is production-ready and includes comprehensive error handling, security measures, and performance optimizations.