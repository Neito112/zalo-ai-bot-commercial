# Automated Setup Script for Zalo Bot MCP Server
Write-Host "🚀 Setting up Zalo Bot MCP Server & Auto-Responder..." -ForegroundColor Green

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 1. Install Node Dependencies
Write-Host "📦 Installing npm dependencies..." -ForegroundColor Yellow
npm install

# 2. Configure mcp_config.json
$McpConfigPath = "$env:USERPROFILE\.gemini\config\mcp_config.json"
Write-Host "⚙️ Registering MCP Server to $McpConfigPath..." -ForegroundColor Yellow

$McpConfig = @{
    "mcpServers" = @{
        "zalo-bot" = @{
            "command" = "node"
            "args" = @("$ScriptDir\index.js")
            "env" = @{
                "ZALO_BOT_TOKEN" = "1814765549758631539:fwyQQnqCQpKOkHjKTDkgYZzDyXodAFbVxOfjarpmSTdUtAeXPEYCsEOYFuXFQbNZ"
                "ZALO_WEBHOOK_URL" = "https://greeting-parkway-reflex.ngrok-free.dev/webhook/940868022467112918:isgiovguljmkmrerrbyhlwvqglpvgoceysyqqsrjfoynbzzvsektpyivkjzhxfvb"
                "ZALO_SECRET_KEY" = "uZ1PXGKOQfn-u5-zM2"
            }
        }
    }
}

$McpConfigJson = $McpConfig | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($McpConfigPath, $McpConfigJson)

Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host "📌 To start the Bot Auto-Responder Daemon, run: .\start-bot.bat" -ForegroundColor Cyan
