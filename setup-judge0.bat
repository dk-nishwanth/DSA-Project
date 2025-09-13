@echo off
echo 🚀 Setting up Judge0 API integration...

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Judge0 API Configuration
        echo # Option 1: Free Judge0 Instance ^(recommended for development^)
        echo VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
        echo VITE_JUDGE0_API_KEY=
        echo.
        echo # Option 2: RapidAPI Judge0 ^(requires API key from https://rapidapi.com/judge0-official/api/judge0-ce^)
        echo # VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
        echo # VITE_JUDGE0_API_KEY=your-rapidapi-key-here
        echo.
        echo # Option 3: Self-hosted Judge0 instance
        echo # VITE_JUDGE0_API_URL=http://localhost:2358
        echo # VITE_JUDGE0_API_KEY=
    ) > .env
    echo ✅ .env file created!
) else (
    echo ⚠️  .env file already exists. Please check judge0-config.env for configuration options.
)

echo.
echo 🔧 Configuration Options:
echo 1. Free Judge0 Instance ^(default^): No API key required, limited requests
echo 2. RapidAPI Judge0: Get API key from https://rapidapi.com/judge0-official/api/judge0-ce
echo 3. Self-hosted: Run your own Judge0 instance
echo.
echo 📖 To configure:
echo 1. Edit the .env file
echo 2. Set VITE_JUDGE0_API_URL and VITE_JUDGE0_API_KEY
echo 3. Restart the development server
echo.
echo 🎉 Setup complete! Judge0 API is ready to use.
pause
