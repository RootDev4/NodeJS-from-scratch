# NodeJS from scratch
Building a NodeJS web application from scratch.

### Install NodeJS and NPM on Windows/MacOS
    Download LTS installer from: https://nodejs.org/en/download/

### Install NodeJS and NPM on Linux
    sudo apt install build-essential checkinstall libssl-dev
    sudo apt install nodejs npm

### Update NodeJS and NPM on Linux
    sudo npm install -g npm   // Update NPM
    sudo npm install -g n     // Install Node.js version management
    sudo n stable|latest      // Update NodeJS with stable or latest version

### Create initial project with default values
    npm init -y

### Install necessary packages
    npm install --save-dev nodemon  // Helps develop applications by automatically restarting when files changes
    npm install --save express express-session passport passport-local cors ejs mongoose

### Adjust package.json configuration file
Do some (optional) changes inside your package.json file. I recommend to rename the main script file into **server.js** to make clear, that this is your server application script.

    {
        "name": "NodeJS-from-Scratch",
        "version": "1.0.0",
        "description": "Building a NodeJS web application from scratch.",
        "main": "server.js",
        "scripts": {
            "start": "node server.js",
            "startDev": "nodemon server.js"
        },
        "keywords": [],
        "author": "",
        "license": "MIT",
        "devDependencies": {
            "nodemon": "^2.0.3"
        },
        "dependencies": {
            "cors": "^2.8.5",
            "ejs": "^3.1.2",
            "express": "^4.17.1",
            "express-session": "^1.17.1",
            "mongoose": "^5.9.10",
            "passport": "^0.4.1",
            "passport-local": "^1.0.0"
        }
    }

### Create a plain JavaScript server.js script
```javascript

```