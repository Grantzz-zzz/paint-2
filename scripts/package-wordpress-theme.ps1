$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$theme = Join-Path $root 'wordpress-theme\superior-plus'
$outputDirectory = Join-Path $root 'wordpress-theme\dist'

if (-not (Test-Path (Join-Path $theme 'style.css'))) {
    throw 'The Superior Plus theme folder is incomplete.'
}

$style = Get-Content (Join-Path $theme 'style.css') -Raw
$versionMatch = [regex]::Match($style, '(?mi)^Version:\s*([^\r\n]+)')
if (-not $versionMatch.Success) {
    throw 'The theme version could not be read from style.css.'
}
$version = $versionMatch.Groups[1].Value.Trim()
$output = Join-Path $outputDirectory "superior-plus-$version.zip"

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

if (Test-Path -LiteralPath $output) {
    $resolvedOutput = (Resolve-Path -LiteralPath $output).Path
    if (-not $resolvedOutput.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to replace a package outside the repository.'
    }
    Remove-Item -LiteralPath $resolvedOutput -Force
}

# bsdtar writes portable forward-slash ZIP entries. Compress-Archive writes
# backslash entries on Windows, which WordPress/Linux may not recognise.
& tar.exe -a -c -f $output -C (Split-Path $theme -Parent) (Split-Path $theme -Leaf)
if ($LASTEXITCODE -ne 0) {
    throw 'tar.exe failed to create the WordPress theme package.'
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($output)
try {
    $entries = @($archive.Entries | ForEach-Object FullName)
    if ($entries -contains 'superior-plus\style.css') {
        throw 'The package contains Windows-style archive paths and is not WordPress-safe.'
    }
    if ($entries -notcontains 'superior-plus/style.css') {
        throw 'The packaged theme is missing superior-plus/style.css.'
    }
    if ($entries -notcontains 'superior-plus/index.php' -or $entries -notcontains 'superior-plus/functions.php') {
        throw 'The packaged theme is missing required WordPress files.'
    }
} finally {
    $archive.Dispose()
}

$package = Get-Item -LiteralPath $output
[pscustomobject]@{
    Package = $package.FullName
    SizeMB = [math]::Round($package.Length / 1MB, 2)
    Version = $version
}
