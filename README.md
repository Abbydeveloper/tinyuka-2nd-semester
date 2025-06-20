# Provisioning A Linux Server

## Provisiong a Linux Server Using AWS 

### Project Directory

```
alt
|-- webpage/
|   |-- assets/
|   |-- index.html
|   |-- index.css
|
|__ README.md
|-- app.js
|-- package-lock.json
|-- package.json
```


### Setup EC2 Instance

Create an AWS account, if not available prior. 
Create and launch an EC2 instance (I used the free tier, and to avoid costs, all settings on the EC2 instance were chosen from the free tier eligible options).
At this point, AWS will ask if you want to create a key pair. This key pair is necessary to be able to connect to the EC2 instance from your local machine. Store the public key presented to you on your local machine
From the terminal on your local machine, conect to the EC2 instance. The cli command is provided on AWS

```
ssh -i <path/to/public/key> ubuntu@<EC2-PUBLIC-IP>
```

### Installations

#### Update and Upgrade software packages

```
sudo apt update
sudo apt upgrade
```
This commanda are used in Linux distributions to manage software packages. `apt update` refreshes the list of available packages and their versions from configured repositories.  `apt upgrade` downloads and installs newer versions of the already installed packages. It is important to run these two commands before any other installations
This will refresh and upgrade server packages

#### Install Applicaionts

These commands will install all the applications used in this setup

##### Nginx

- Install nginx

```sudo apt install nginx```

- Configure a reverse proxy

Create new configuration file in the ```/etc/nginx/sites-available/``` folder.


```
server {
    listen 80;
    index  index.html;

    server_name abigailadeboga.duckdns.org www.abigailadeboga.duckdns.org;

    location / {
        proxy_pass "http://localhost:3000";
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        include proxy_params;
    }

    location /static/ {
        alias /home/ubuntu/alt/webpage;
    }
}
```
 - Enable the configuration

 Create a symbolic link between the configuration file just created and the `sites-enabled` folder. This will ensure that all changes made in the configuration file are captured by nginx

 ```
 sudo ln -s /etc/nginx/sites-available/<config file> /etc/nginx/sites-enabled
 ```

- Test the nginx configuration

```sudo nginx -t```

If successful, start nginx

- Start Nginx

```
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

##### Nodejs and NPM

- Install Nodejs and npm
``` sudo apt install nodejs npm```

##### PM2

- Install `pm2`, a `nodejs` process manager. `pm2`  will ensure the `nodejs` server runs in the background.

```
sudo npm install -g pm2
sudo pm2 start app.js
sudo pm2 save
sudo pm2 startup
```

##### Firewall (UFW)

- Install and enable `ufw`, 

```
sudo apt install ufw
sudo ufw enable
```

- Setup firewall rules using ufw

```
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 'Nginx HTTP'
```

#####

### Setup Repository

On github, create a repository for the project. This repository will be cloned into the server.
Add a README.md file, and a `.gitignore` file. Within the `.gitignore` file, type `/node__modules/`. This will ensure the `node_modules` folder is not pushed to git.

From the EC2 instance, generate a new ssh key, to be added to github. This ssh key is necessary to be able to clone the repository.

Set up the files (as shown in the project directory).

#### Run node server

If starting the project from scratch, run

```
npm init
```

This will set up the `package.json`. Then install all dependencies used in setting up the node server.

If not, simply run
 ```
 npm install
 ```

 This will download all the packages indicated in the `package.json` and `package-lock.json` files

### Secure with Let's Encrypt SSL (Certbot)

Let's Encrypt offers free SSL certificates, valid for up to 90 days.

- Install Certbot

```
sudo apt install certbort
sudo apt install python3-cerbot-nginx
sudo certbot --nginx -d <EC2-INSTANCE-DOMAIN>
```

Running this commands with obtain a free certificate, enable HTTPS for the domain, and also configure `nginx` to use the SSL certificate. 


The web app is available at https://abigailadeboga.duckdns.org
