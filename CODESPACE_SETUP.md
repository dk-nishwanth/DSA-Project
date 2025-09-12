# Codespace Setup Guide

This guide will help you set up the VS Code-like codespace with Docker-based code execution.

## Prerequisites

1. **Docker**: Install Docker Desktop or Docker Engine
2. **Node.js**: Version 16 or higher
3. **npm/yarn**: Package manager

## Frontend Setup

1. **Install dependencies**:
```bash
npm install @monaco-editor/react monaco-editor xterm xterm-addon-fit xterm-addon-web-links lucide-react react-resizable-panels
```

2. **Add environment variable** (optional):
Create `.env.local` in your React project root:
```
REACT_APP_EXECUTION_API_URL=http://localhost:3001/api
```

3. **Add to your routing**:
```tsx
import { CodespacePage } from './pages/CodespacePage';

// In your router
<Route path="/codespace" element={<CodespacePage />} />
```

## Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the project**:
```bash
npm run build
```

4. **Start the development server**:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## Docker Setup

### Option 1: Using Docker Compose (Recommended)

1. **Build and start**:
```bash
cd backend
docker-compose up --build
```

### Option 2: Manual Docker Setup

1. **Build the backend image**:
```bash
cd backend
npm run build
docker build -t codespace-backend .
```

2. **Run the container**:
```bash
docker run -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock codespace-backend
```

## Language Images Setup

The system will automatically pull required Docker images when first used. To pre-pull them:

```bash
# Core languages
docker pull python:3.11-alpine
docker pull node:18-alpine
docker pull openjdk:17-alpine
docker pull gcc:latest
docker pull golang:alpine
docker pull rust:alpine
docker pull php:8.2-cli-alpine
docker pull ruby:alpine
docker pull mono:latest
docker pull alpine:latest
```

## Security Configuration

### Docker Security
The backend runs code in isolated Docker containers with:
- No network access (`--network none`)
- Memory limits (128MB default)
- CPU limits (0.5 cores default)
- Process limits (50 processes max)
- Execution timeout (10 seconds default)
- Temporary filesystem for workspace

### Rate Limiting
- General API: 100 requests per 15 minutes per IP
- Code execution: 10 executions per minute per IP

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

### Frontend (.env.local)
```bash
REACT_APP_EXECUTION_API_URL=http://localhost:3001/api
```

## Integration with Existing Site

### 1. Add Route
```tsx
// In your main App.tsx or router
import { CodespacePage } from './pages/CodespacePage';

<Route path="/codespace" element={<CodespacePage />} />
```

### 2. Add Navigation Link
```tsx
// In your navigation component
<Link to="/codespace" className="nav-link">
  <Code className="w-4 h-4" />
  Codespace
</Link>
```

### 3. Embed in Existing Page
```tsx
// To embed in an existing page
import { Codespace } from './components/codespace/Codespace';

function MyPage() {
  return (
    <div>
      <h1>My Existing Content</h1>
      
      <div className="h-96 my-8">
        <Codespace 
          initialLanguage="python"
          initialCode="print('Hello from embedded codespace!')"
        />
      </div>
      
      <p>More existing content...</p>
    </div>
  );
}
```

## Customization

### Adding New Languages

1. **Update language config** (`src/config/languages.ts`):
```tsx
{
  id: 'kotlin',
  name: 'Kotlin',
  extension: '.kt',
  monacoLanguage: 'kotlin',
  defaultCode: 'fun main() { println("Hello, World!") }',
  compileCommand: 'kotlinc Main.kt -include-runtime -d Main.jar',
  runCommand: 'java -jar Main.jar',
  dockerImage: 'zenika/kotlin:latest',
  supportsInput: true,
  icon: '🎯'
}
```

2. **Pull the Docker image**:
```bash
docker pull zenika/kotlin:latest
```

### Theming
The codespace respects your site's dark/light mode. Customize colors in the component CSS classes.

### Monaco Editor Configuration
Modify `MonacoEditor.tsx` to add:
- Custom themes
- Additional language support
- Custom keyboard shortcuts
- IntelliSense configurations

## Troubleshooting

### Common Issues

1. **Docker permission denied**:
```bash
sudo usermod -aG docker $USER
# Then logout and login again
```

2. **Port already in use**:
```bash
# Kill process on port 3001
sudo lsof -ti:3001 | xargs kill -9
```

3. **Docker images not pulling**:
```bash
# Check Docker daemon
docker info
# Manually pull images
docker pull python:3.11-alpine
```

4. **CORS errors**:
Ensure `FRONTEND_URL` environment variable matches your frontend URL.

### Logs
Backend logs are stored in `backend/logs/`:
- `combined.log`: All logs
- `error.log`: Error logs only

### Health Check
Visit `http://localhost:3001/api/health` to check backend status.

## Production Deployment

### Backend Deployment
1. Use a process manager like PM2
2. Set up reverse proxy (nginx)
3. Configure SSL certificates
4. Set up log rotation
5. Monitor Docker daemon

### Security Hardening
1. Run backend as non-root user
2. Use Docker rootless mode
3. Set up firewall rules
4. Regular security updates
5. Monitor resource usage

### Scaling
- Use Docker Swarm or Kubernetes for container orchestration
- Implement queue system for high-load scenarios
- Add Redis for caching and session management
- Use load balancer for multiple backend instances

## Future Extensions

The architecture supports adding:
- File explorer sidebar
- Terminal emulation (xterm.js)
- Debugging support
- Collaborative editing
- Git integration
- Package manager integration
- Custom Docker images per user
- Persistent workspaces

## Support

For issues and questions:
1. Check the logs in `backend/logs/`
2. Verify Docker is running: `docker info`
3. Test backend health: `curl http://localhost:3001/api/health`
4. Check browser console for frontend errors