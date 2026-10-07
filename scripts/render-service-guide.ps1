$ErrorActionPreference = 'Stop'

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$docs = Join-Path $root 'docs'
$markdownPath = Join-Path $docs 'SERVICE_PAGE_MANAGEMENT_GUIDE.md'
$templatePath = Join-Path $docs 'SUPERIOR_PLUS_WORDPRESS_EDITOR_GUIDE.html'
$htmlPath = Join-Path $docs 'SERVICE_PAGE_MANAGEMENT_GUIDE.html'
$pdfPath = Join-Path $docs 'SERVICE_PAGE_MANAGEMENT_GUIDE.pdf'

$template = Get-Content -LiteralPath $templatePath -Raw
$style = [regex]::Match($template, '(?s)<style>(.*?)</style>').Groups[1].Value
$markdown = Get-Content -LiteralPath $markdownPath -Raw
$lines = $markdown -split "`r?`n"
$builder = [System.Text.StringBuilder]::new()

function Encode([string]$value) {
    return [System.Net.WebUtility]::HtmlEncode($value)
}

function Inline([string]$value) {
    $result = Encode $value
    $result = [regex]::Replace($result, '`([^`]+)`', '<code>$1</code>')
    $result = [regex]::Replace($result, '\*\*([^*]+)\*\*', '<strong>$1</strong>')
    return $result
}

[void]$builder.AppendLine('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Superior Plus Service Page Management Guide</title><style>')
[void]$builder.AppendLine($style)
[void]$builder.AppendLine('</style></head><body>')
[void]$builder.AppendLine('<section class="cover"><div><div class="kicker">Superior Plus Painting &amp; Remodeling</div><h1>Service Page Management Guide</h1><p class="lead">A practical client handbook for creating, editing, previewing, publishing and verifying service pages on the live website.</p></div><div class="meta"><div><b>Website</b>sppaintingremodeling.com.au</div><div><b>Content system</b>Superior Plus Content plugin</div><div><b>Workflow</b>Draft &rarr; Preview &rarr; Publish &rarr; Verify</div><div><b>Editing principle</b>Change content; keep design locked</div></div></section>')

$sectionOpen = $false
$listType = ''
$inCode = $false

function CloseList {
    param([System.Text.StringBuilder]$Target)
    if ($script:listType) {
        [void]$Target.AppendLine("</$script:listType>")
        $script:listType = ''
    }
}

foreach ($line in $lines) {
    if ($line -eq '```') {
        CloseList $builder
        if ($inCode) {
            [void]$builder.AppendLine('</pre>')
            $inCode = $false
        } else {
            [void]$builder.AppendLine('<pre>')
            $inCode = $true
        }
        continue
    }
    if ($inCode) {
        [void]$builder.AppendLine((Encode $line))
        continue
    }
    if ($line -match '^# (.+)$') { continue }
    if ($line -match '^## (.+)$') {
        CloseList $builder
        if ($sectionOpen) { [void]$builder.AppendLine('</section>') }
        $heading = Inline $Matches[1]
        [void]$builder.AppendLine('<section class="page"><span class="label">Service pages</span><h2>' + $heading + '</h2>')
        $sectionOpen = $true
        continue
    }
    if ($line -match '^### (.+)$') {
        CloseList $builder
        [void]$builder.AppendLine('<h3>' + (Inline $Matches[1]) + '</h3>')
        continue
    }
    if ($line -match '^- (.+)$') {
        if ($listType -ne 'ul') {
            CloseList $builder
            [void]$builder.AppendLine('<ul>')
            $listType = 'ul'
        }
        [void]$builder.AppendLine('<li>' + (Inline $Matches[1]) + '</li>')
        continue
    }
    if ($line -match '^\d+\. (.+)$') {
        if ($listType -ne 'ol') {
            CloseList $builder
            [void]$builder.AppendLine('<ol>')
            $listType = 'ol'
        }
        [void]$builder.AppendLine('<li>' + (Inline $Matches[1]) + '</li>')
        continue
    }
    if ([string]::IsNullOrWhiteSpace($line)) {
        CloseList $builder
        continue
    }
    CloseList $builder
    [void]$builder.AppendLine('<p>' + (Inline $line) + '</p>')
}

CloseList $builder
if ($inCode) { [void]$builder.AppendLine('</pre>') }
if ($sectionOpen) { [void]$builder.AppendLine('</section>') }
[void]$builder.AppendLine('<p class="footer">Superior Plus Service Page Management Guide &middot; Prepared for sppaintingremodeling.com.au</p></body></html>')
$builder.ToString() | Set-Content -LiteralPath $htmlPath -Encoding UTF8

& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=$pdfPath ('file:///' + ($htmlPath -replace '\\','/'))
if ($LASTEXITCODE -ne 0) { throw 'Chrome failed to create the PDF.' }

[pscustomobject]@{
    HTML = $htmlPath
    PDF = $pdfPath
    SizeKB = [math]::Round((Get-Item -LiteralPath $pdfPath).Length / 1KB, 1)
}
