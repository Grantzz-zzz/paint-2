$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$source = (Resolve-Path (Join-Path $root 'dist')).Path
$target = (Resolve-Path (Join-Path $root 'wordpress-theme\superior-plus\react-dist')).Path
$expectedTarget = [System.IO.Path]::GetFullPath((Join-Path $root 'wordpress-theme\superior-plus\react-dist'))

if ($target -ne $expectedTarget -or -not $target.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Refusing to replace a React bundle outside the verified WordPress theme directory.'
}

if (-not (Test-Path -LiteralPath (Join-Path $source 'index.html')) -or -not (Test-Path -LiteralPath (Join-Path $source '.vite\manifest.json'))) {
    throw 'The production React build is incomplete. Run npm run build first.'
}

Get-ChildItem -LiteralPath $target -Force | Remove-Item -Recurse -Force
Copy-Item -Path (Join-Path $source '*') -Destination $target -Recurse -Force
Copy-Item -Path (Join-Path $source '.vite') -Destination $target -Recurse -Force

$sourceManifest = Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $source '.vite\manifest.json')
$targetManifest = Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $target '.vite\manifest.json')
if ($sourceManifest.Hash -ne $targetManifest.Hash) {
    throw 'The WordPress theme bundle did not match the production build.'
}

[pscustomobject]@{
    Source = $source
    Target = $target
    ManifestSHA256 = $targetManifest.Hash
}
