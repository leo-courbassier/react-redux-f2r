# React Redux F2R Front End Application

### Installation / Deployment Steps

  - Install Node / NPM on Linux or Mac
     - `brew install node` (Mac)** or `sudo apt-get install nodejs` (debian based distro)
     - [sudo] `npm install npm@latest -g`

** install Homebrew on Mac for easier install, paste in terminal:  
    `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

- git pull repo
- from root dir, `npm install`
- `npm run build` builds to the /dist folder
- files in /dist folder are copied to server root. (can't be in subfolder for routing to work)
