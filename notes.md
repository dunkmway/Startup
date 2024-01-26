# Notes

This is actually a pretty good idea! Usaully I just have a text file for my notes which looks ugly but now with a markdown file, I can even see the preview nicely rendered in VScode.

## EC2 Server Instance
Elastic IP Address : 44.222.16.138

SSH Command : ssh -i [Server Pem File] ubuntu@44.222.16.138

Custom Domain : [startup.duncanmorais.com](http://startup.duncanmorais.com)

## Certificates
Caddy just does it for me! That's awesome! Manually generating the certificates and then having them get signed sucks to do.

## Deploying
./deployFiles.sh -k [pemkey] -h [domain] -s [service]

Created a custom deployment file with my pemkey and domain hardcoded. Will gitignore this file to not expose my file structure.

I also added in a public folder in my own source directory to clean things up so the new deployment script will only deploy these files.

./customDeploy.sh -s [service]


## Home page
I want to show something to not signed in people so maybe we show upcoming events.
Then if they want to click on them or do anything they'll have to sign in.
Should we be showing some past and currently happening events as well?
