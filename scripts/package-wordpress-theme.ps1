$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$theme = Join-Path $root 'wordpress-theme\superior-plus'
$outputDirectory = Join-Path $root 'wordpress-theme\dist'
$output = Join-Path $outputDirectory 'superior-plus-1.0.0.zip'

if (-not (Test-Path (Join-Path $theme 'style.css'))) {
    throw 'The Superior Plus theme folder is incomplete.'
}

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

if (Test-Path -LiteralPath $output) {
    $resolvedOutput = (Resolve-Path -LiteralPath $output).Path
    if (-not $resolvedOutput.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to replace a package outside the repository.'
    }
    Remove-Item -LiteralPath $resolvedOutput -Force
}

Compress-Archive -Path $theme -DestinationPath $output -CompressionLevel Optimal

$package = Get-Item -LiteralPath $output
[pscustomobject]@{
    Package = $package.FullName
    SizeMB = [math]::Round($package.Length / 1MB, 2)
}

