# Full Automated Installer & MCP Configurator for Zalo Bot
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " 🤖 AUTOMATED SETUP: ZALO BOT MCP & AUTO-RESPONDER" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js is not installed. Please install Node.js (v18+) first." -ForegroundColor Red
    exit 1
}

# 2. Install npm dependencies
Write-Host "📦 Step 1: Installing npm packages..." -ForegroundColor Yellow
npm install

# 3. Configure Antigravity MCP Config
$McpConfigDir = "$env:USERPROFILE\.gemini\config"
$McpConfigPath = "$McpConfigDir\mcp_config.json"

if (-not (Test-Path $McpConfigDir)) {
    New-Item -ItemType Directory -Path $McpConfigDir -Force | Out-Null
}

Write-Host "⚙️ Step 2: Registering Zalo Bot MCP Server in $McpConfigPath..." -ForegroundColor Yellow

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

# 4. Verify Bot Token Connection
Write-Host "🔍 Step 3: Verifying Zalo Bot Token Connection..." -ForegroundColor Yellow
$TestCode = "import { createRequire } from 'module'; const require = createRequire(import.meta.url); const { Bot } = require('zalo-bot-js'); const bot = new Bot('1814765549758631539:fwyQQnqCQpKOkHjKTDkgYZzDyXodAFbVxOfjarpmSTdUtAeXPEYCsEOYFuXFQbNZ'); bot.getMe().then(me => console.log('✅ Connected to Bot:', me.displayName, '(' + me.id + ')')).catch(err => console.error('❌ Connection Failed:', err.message));"

node -e $TestCode

Write-Host ""
Write-Host "🎉 ALL SETUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "------------------------------------------------------" -ForegroundColor Gray
Write-Host "📌 To run the Auto-Responder Daemon: Double-click 'start-bot.bat' or run 'node bot-service.js'" -ForegroundColor Cyan
Write-Host "📌 MCP Tools registered: zalo_get_me, zalo_send_message, zalo_send_photo, zalo_send_chat_action, zalo_set_webhook, zalo_get_webhook_info" -ForegroundColor Cyan
Write-Host "------------------------------------------------------" -ForegroundColor Gray
