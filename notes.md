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
Handling time is too much
instead of events just make it location based chat but once you check in once you have unlimited access to read chats but can't send more

instead of showing all events just show ones near me
will need to implement a way to see if bounds is found within certain radius, probably just check center point is within radius

would also be cool to see a single map with all locations close by on a single map but not necessary

## Chat
Need to implement checkin
I can treat the checkin as a message and then render it like when someone is added to a chat in ios or teams
checkin will check if you are within the bounds of the event
then I can just check all events for a checkin message from the user to set the isPublic boolean

they can only send messages if physically there

need to add in public toggle for user messages
