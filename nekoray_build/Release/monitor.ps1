$profilesPath = "C:\Users\55237\Lossless-Superpower-JS\nekoray_build\Release\config\profiles"
$logFile = "C:\Users\55237\Lossless-Superpower-JS\nekoray_build\Release\config\monitor.log"

# 清理旧日志
"$(Get-Date) - 开始监控配置文件变化" | Out-File -FilePath $logFile -Force

# 创建测试配置文件
if (-not (Test-Path $profilesPath)) {
    New-Item -ItemType Directory -Path $profilesPath -Force
}

"$(Get-Date) - 创建测试配置文件" | Out-File -FilePath $logFile -Append
New-Item -ItemType File -Path "$profilesPath\0.json" -Value '{"type":"socks","id":0,"gid":0,"bean":{"v":5,"name":"测试代理","serverAddress":"127.0.0.1","serverPort":1080}}' -Force

# 显示初始文件列表
"$(Get-Date) - 初始文件列表:" | Out-File -FilePath $logFile -Append
Get-ChildItem $profilesPath | Out-File -FilePath $logFile -Append

# 启动NekoBox
"$(Get-Date) - 启动NekoBox" | Out-File -FilePath $logFile -Append
Start-Process -FilePath "C:\Users\55237\Lossless-Superpower-JS\nekoray_build\Release\nekobox.exe" -PassThru

# 监控文件变化
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Seconds 2
    "$(Get-Date) - 第 $($i+1) 次检查:" | Out-File -FilePath $logFile -Append
    Get-ChildItem $profilesPath -ErrorAction SilentlyContinue | Out-File -FilePath $logFile -Append
    if (-not (Test-Path "$profilesPath\0.json")) {
        "$(Get-Date) - 配置文件被删除！" | Out-File -FilePath $logFile -Append
        break
    }
}

"$(Get-Date) - 监控结束" | Out-File -FilePath $logFile -Append