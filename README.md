# Yealink DECT Remote Reboot Script (no provisioning required)

In case you want to restart your Yealink DECT device(s), this is a simple playwright script that automates the steps you'd normally run manually in the web interface.

## Usage

### 🪟 **Windows users:**

```powershell
# You'll need to install nodejs and git, if you haven't already
winget install -e --id OpenJS.NodeJS
winget install -e --id Git.Git

# Restart your terminal if you installed any of the above, then proceed to clone this repository and install the dependencies
git clone git@github.com:datio/yealink-reboot.git
cd yealink-reboot
npm install
npx playwright install

# Configure your devices in the `.env.yaml` file
cp .env.yml.example .env.yml
code .env.yml # or use any other editor instead of vscode

# Run it
node .\index.js

```

### 🐧 **Linux users:** 
Similar steps as above, but tailored to your distro.
