Let’s try WSL2 IP Bridging via wsl interface workaround (advanced):

From WSL2, get the IP address:
ip addr show eth0

Look for something like:
inet 172.20.88.163/20

From Windows, run:
netsh interface portproxy add v4tov4 listenaddress=192.168.1.42 listenport=3000 connectaddress=172.20.88.163 connectport=3000

This bridges your Windows IP to WSL2.

Then try accessing from iPhone again:
http://192.168.1.42:3000
