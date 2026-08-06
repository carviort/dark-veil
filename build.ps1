# Empaqueta la extensión para subirla a la Chrome Web Store.
# Equivalente a build.sh, para Windows (Git Bash no trae el comando `zip`).
# El manifest.json queda en la raíz del zip, que es como lo exige el panel.

$ErrorActionPreference = "Stop"

$Root  = $PSScriptRoot
$Ver   = (Get-Content "$Root\manifest.json" -Raw | ConvertFrom-Json).version
$Out   = "$Root\dist\dark-veil-store-$Ver.zip"
$Stage = "$Root\dist\_stage"

New-Item -ItemType Directory -Force -Path "$Root\dist" | Out-Null
Remove-Item $Stage -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $Out -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $Stage | Out-Null

# Solo lo que la extensión usa: fuera README, licencia, scripts y .git
Copy-Item "$Root\manifest.json" $Stage
Copy-Item "$Root\src","$Root\popup","$Root\icons" $Stage -Recurse

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($Stage, $Out)
Remove-Item $Stage -Recurse -Force

$zip = [System.IO.Compression.ZipFile]::OpenRead($Out)
$zip.Entries | Select-Object FullName
$zip.Dispose()

Write-Host "Listo: $Out"
