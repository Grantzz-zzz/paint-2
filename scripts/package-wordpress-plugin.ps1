$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$plugin = Join-Path $root 'wordpress-plugin\superior-plus-content'
$outputDirectory = Join-Path $root 'wordpress-plugin\dist'
$mainFile = Join-Path $plugin 'superior-plus-content.php'

if (-not (Test-Path -LiteralPath $mainFile)) {
    throw 'The Superior Plus Content plugin folder is incomplete.'
}

$header = Get-Content -LiteralPath $mainFile -Raw
$versionMatch = [regex]::Match($header, '(?mi)^\s*\*\s*Version:\s*([^\r\n]+)')
if (-not $versionMatch.Success) {
    throw 'The plugin version could not be read from superior-plus-content.php.'
}

$version = $versionMatch.Groups[1].Value.Trim()
$output = Join-Path $outputDirectory "superior-plus-content-$version.zip"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

if (Test-Path -LiteralPath $output) {
    $resolvedOutput = (Resolve-Path -LiteralPath $output).Path
    if (-not $resolvedOutput.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to replace a package outside the repository.'
    }
    Remove-Item -LiteralPath $resolvedOutput -Force
}

& tar.exe -a -c -f $output -C (Split-Path $plugin -Parent) (Split-Path $plugin -Leaf)
if ($LASTEXITCODE -ne 0) {
    throw 'tar.exe failed to create the WordPress plugin package.'
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($output)
try {
    $entries = @($archive.Entries | ForEach-Object FullName)
    if ($entries -contains 'superior-plus-content\superior-plus-content.php') {
        throw 'The package contains Windows-style archive paths and is not WordPress-safe.'
    }
    if ($entries -notcontains 'superior-plus-content/superior-plus-content.php') {
        throw 'The packaged plugin is missing its main plugin file.'
    }
    if ($entries -notcontains 'superior-plus-content/includes/class-spp-content-rest.php') {
        throw 'The packaged plugin is missing its REST implementation.'
    }
} finally {
    $archive.Dispose()
}

$package = Get-Item -LiteralPath $output
[pscustomobject]@{
    Package = $package.FullName
    SizeKB = [math]::Round($package.Length / 1KB, 2)
    Version = $version
}
