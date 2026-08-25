# Lightweight static server for Windows PowerShell
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Code Brains Clone Server Running" -ForegroundColor Green
Write-Host " URL: http://localhost:$port/" -ForegroundColor Yellow
Write-Host " Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan

Start-Process "http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path) -or $path.EndsWith('/')) {
            $path += "index.html"
        }

        $localPath = Join-Path (Get-Location) $path
        
        # Handle clean URLs (e.g. /domain/ml-python -> /domain/ml-python.html or /domain/ml-python/index.html)
        if (-not (Test-Path $localPath)) {
            if (Test-Path "$localPath.html") {
                $localPath = "$localPath.html"
            } elseif (Test-Path (Join-Path $localPath "index.html")) {
                $localPath = Join-Path $localPath "index.html"
            }
        }

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".json" { "application/json" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
