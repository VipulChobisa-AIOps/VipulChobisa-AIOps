# PowerShell Git Automation script for Vipul Chobisa's AI-Ops Portfolio

$rootPath = $PSScriptRoot
$repositoriesDir = Join-Path $rootPath "repositories"

Write-Output "=== Starting Git Portfolio Initialization ==="
Write-Output "Portfolio Root: $rootPath"

# 1. Initialize Profile Repository
Write-Output "----------------------------------------"
Write-Output "Initializing GitHub Profile Landing Repo..."
Set-Location -Path $rootPath
if (-not (Test-Path ".git")) {
    git init
    git checkout -b main
}
git config user.email "vipulchobisa@gmail.com"
git config user.name "Vipul Kumar Chobisa"
git add README.md linkedin_branding_dossier.md setup-portfolio.ps1
git commit -m "initial: setup profile details and professional dossier"
Write-Output "GitHub Profile Landing Repo Initialized."

# 2. Initialize Repositories folders
if (Test-Path $repositoriesDir) {
    $repos = Get-ChildItem -Path $repositoriesDir -Directory
    foreach ($r in $repos) {
        Write-Output "----------------------------------------"
        Write-Output "Initializing Repository: $($r.Name)..."
        Set-Location -Path $r.FullName
        if (-not (Test-Path ".git")) {
            git init
            git checkout -b main
        }
        git config user.email "vipulchobisa@gmail.com"
        git config user.name "Vipul Kumar Chobisa"
        git add .
        git commit -m "initial: upload repository codebase template and documentation"
        Write-Output "Repository $($r.Name) Initialized successfully."
    }
}

Set-Location -Path $rootPath
Write-Output "========================================"
Write-Output "Portfolio Setup Completed Successfully!"
Write-Output "You can now go into any repository folder and add your remote repository URL using:"
Write-Output "  git remote add origin https://github.com/VipulChobisa_AIOps/<repo-name>.git"
Write-Output "  git push -u origin main"
Write-Output "========================================"
