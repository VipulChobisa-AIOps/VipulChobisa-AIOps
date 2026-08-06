import os
import subprocess
import urllib.request
import json

pat = os.environ.get("GITHUB_TOKEN", "YOUR_GITHUB_TOKEN")
username = "VipulChobisa-AIOps"

repos_to_create = [
    "VipulChobisa-AIOps",
    "afwpixelai",
    "stockP",
    "askforwrite-digital",
    "answer-engine-data",
    "afwpixelai-marketing-suite",
    "personal-portfolio-web",
    "reelscript",
    "Smart-Warehouse-Automation-System",
    "field-force-management",
    "afwresearchai-copilot"
]

def create_repo(name):
    url = "https://api.github.com/user/repos"
    data = json.dumps({"name": name, "private": False, "auto_init": False}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"token {pat}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "Portfolio-Automator"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully created repository: {name}")
    except Exception as e:
        print(f"Info/Error creating {name} (it may already exist): {e}")

# 1. Create repos on GitHub
print("=== Creating repositories on GitHub ===")
for repo in repos_to_create:
    create_repo(repo)

# 2. Map local folders to remote URLs
mapping = {
    ".": "VipulChobisa-AIOps",
    "repositories/afwpixelai": "afwpixelai",
    "repositories/stockP": "stockP",
    "repositories/askforwrite-digital": "askforwrite-digital",
    "repositories/answer-engine-data": "answer-engine-data",
    "repositories/Smart-Warehouse-Automation-System": "Smart-Warehouse-Automation-System",
    "repositories/afwpixelai-marketing-suite": "afwpixelai-marketing-suite",
    "repositories/personal-portfolio-web": "personal-portfolio-web",
    "repositories/reelscript": "reelscript",
    "repositories/field-force-management": "field-force-management",
    "repositories/afwresearchai-copilot": "afwresearchai-copilot"
}

# Dynamically locate the directory containing the script
root_dir = os.path.dirname(os.path.abspath(__file__))

print(f"Using portfolio root directory: {root_dir}")

print("\n=== Pushing local repos to GitHub ===")
for local_rel_path, repo_name in mapping.items():
    local_path = os.path.normpath(os.path.join(root_dir, local_rel_path))
    print(f"\nProcessing: {local_rel_path} -> {repo_name}")
    
    if not os.path.exists(local_path):
        print(f"Directory {local_path} does not exist. Skipping.")
        continue
        
    os.chdir(local_path)
    
    # Remove existing origin if configured
    subprocess.run(["git", "remote", "remove", "origin"], capture_output=True)
    
    # Add authenticated remote
    remote_url = f"https://{username}:{pat}@github.com/{username}/{repo_name}.git"
    subprocess.run(["git", "remote", "add", "origin", remote_url], check=True)
    
    # Push to main
    res = subprocess.run(["git", "push", "-u", "origin", "main", "--force"], capture_output=True, text=True)
    if res.returncode == 0:
        print(f"Successfully pushed {repo_name}!")
    else:
        print(f"Failed to push {repo_name}:\n{res.stderr}")

print("\n=== Automation Completed! ===")

