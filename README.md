1. Why Use Two Instances

When deploying an application on Amazon EC2, developers usually create two servers:

Instance	Purpose	Who Uses It
Staging	Testing environment	Developers
Production	Live environment	Real users
Logic
Developer writes code
        ↓
Deploy to STAGING server
        ↓
Test the application
        ↓
If everything works → deploy to PRODUCTION

This prevents bugs from reaching real users.

2. Example Scenario

You add a new login feature.

Without staging:

Code → Deploy to production → Bug → Users cannot login

With staging:

Code → Deploy to staging
     ↓
Test login feature
     ↓
Fix bugs
     ↓
Deploy to production

Users only see the stable version.

3. Architecture
Developer Laptop
       ↓
Git Repository
       ↓
STAGING SERVER
       ↓
PRODUCTION SERVER

Both servers run the same application, but their purpose is different.

4. Creating Two Instances

In Amazon Web Services → Amazon EC2 create two servers.

Instance 1
Name: staging-server
Purpose: testing
Instance 2
Name: production-server
Purpose: live application

Typical configuration:

OS: Ubuntu 22.04
Instance type: t2.micro / t3.micro
Storage: 20GB
5. Cloning the Same Repository

Both servers usually run the same project.

Example:

git clone https://github.com/username/project.git

So both servers have the same codebase.

The difference is how and when they are updated.

6. Deployment Workflow
Step 1 – Deploy to Staging

On staging server:

git pull
pnpm install
pnpm run build
pm2 restart all

Test everything.

Step 2 – Deploy to Production

If everything works:

git pull
pnpm install
pnpm run build
pm2 restart all

Now the update goes live.

7. Security Group Port Logic

Each EC2 instance has a security group (a firewall).

Example ports:

Port	Purpose
22	SSH access
80	HTTP website
443	HTTPS website

Usually you open only these ports:

22
80
443
8. Why Not Open Ports Like 3000 or 8080

Your application might run internally on:

3000 → Next.js app
3001 → Backend API
8080 → WebSocket

But users should not access these directly.

Instead, Nginx listens on port 80 and forwards traffic internally.

Example:

User request
     ↓
Port 80 (Nginx)
     ↓
Next.js app → port 3000
Backend API → port 3001
WebSocket → port 8080

So ports 3000, 3001, 8080 remain private.

9. Security Groups for Both Instances

Usually both staging and production have similar rules:

Inbound Rules

SSH   → port 22
HTTP  → port 80
HTTPS → port 443

Everything else stays closed.

10. Final Concept
STAGING SERVER
• Used for testing
• Developers deploy first here

PRODUCTION SERVER
• Used by real users
• Only stable versions are deployed

This is a standard deployment practice used by most companies running applications on Amazon EC2.


# Steps

# 1. Connect to the Server via SSH
## Connect to your EC2 instance using your SSH private key
    ssh -i ~/.ssh/id_ed25519 ubuntu@YOUR_SERVER_IP

    Example: ssh -i ~/.ssh/id_ed25519 ubuntu@34.236.36.74

# 2. Update the Server
## Update package list
    sudo apt update

## Upgrade installed packages
    sudo apt upgrade -y

# 3. Install Nginx
## Install nginx web server
sudo apt install nginx -y

Check installation:

## Check nginx version
nginx -v

# 4. Start and Enable Nginx
## Start nginx service
sudo systemctl start nginx

## Enable nginx to start automatically on boot
sudo systemctl enable nginx

Check status:

## Verify nginx is running
sudo systemctl status nginx

# 5. Check Port 80
## Check which service is using port 80
sudo lsof -i :80

# 6. Test Nginx
## Test nginx locally
curl localhost

Expected output: Welcome to nginx!

# 7. Fix Low RAM Issue (Add Swap Memory)

Your Next.js build was stuck because the instance had low RAM.
So we created swap memory.

## Create a 2GB swap file
sudo fallocate -l 2G /swapfile

## Secure the swap file permissions
sudo chmod 600 /swapfile

## Setup swap area
sudo mkswap /swapfile

## Enable swap
sudo swapon /swapfile

Verify swap:  free -h

# 8. Build the Next.js Application

Inside your project directory:

## Go to web app folder
cd ~/deployOnAws/apps/web

## Install dependencies
pnpm install

## Build production version
pnpm run build

# 9. Run Services with PM2

You used PM2 to manage Node processes.

Check running apps:

pm2 status

View logs:

pm2 logs

Restart app:

pm2 restart "web app"

# 10. Understand Nginx Config Structure

Main config file:

/etc/nginx/nginx.conf

Site configs:

/etc/nginx/sites-available/

Enabled sites:

/etc/nginx/sites-enabled/

The main file includes site configs:

include /etc/nginx/sites-enabled/*;

# 11. Configure Nginx Reverse Proxy

Open the default site config:

sudo nano /etc/nginx/sites-available/default

Replace with:

server {
    listen 80;
    server_name _;

    # Forward main website requests to Next.js server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Backend API
    location /backend/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
    }

    # WebSocket server
    location /ws/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

Save and exit.

# 12. Ensure Site is Enabled
ls /etc/nginx/sites-enabled

If not enabled:

sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# 13. Test Nginx Configuration
sudo nginx -t

Expected output:

syntax is ok
test is successful

# 14. Restart Nginx
sudo systemctl restart nginx

# 15. Test Deployment

Local test:

curl localhost

Browser test:

http://YOUR_SERVER_IP

Example:

http://34.236.36.74

# 16. Final Production Architecture

Your server now works like this:

Internet
   ↓
Nginx (Port 80)
   ↓
Next.js App (Port 3000)
Backend API (Port 3001)
WebSocket Server (Port 8080)

Users only access:

http://SERVER_IP

Internal services stay hidden.

# 17. AWS Security Group Setup

Only these ports need to be open:

22   SSH
80   HTTP
443  HTTPS (future)

Ports like:

3000
3001
8080

should remain private.