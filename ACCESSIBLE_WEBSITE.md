Let’s try WSL2 IP Bridging via wsl interface workaround (advanced):

From WSL2, get the IP address:
ip addr show eth0

Look for something like:
inet 172.29.72.226/20

From Windows, run:
netsh interface portproxy add v4tov4 listenaddress=192.168.2.226 listenport=3000 connectaddress=172.29.72.226 connectport=3000
This bridges your Windows IP to WSL2.

netsh interface portproxy show all
should say:

```
Address         Port        Address         Port
--------------- ----------  --------------- ----------
192.168.2.226   3000        172.29.72.226   3000
```

and: netstat -an | findstr :3000
TCP 192.168.2.226:3000 0.0.0.0:0 LISTENING

Then try accessing from iPhone again:
http://192.168.2.226:3000

HANDLING REGISTRY ERROR:
If:
PS C:\WINDOWS\system32> reg query HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters /v IPEnableRouter

ERROR: The system was unable to find the specified registry key or value.

Then:
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v IPEnableRouter /t REG_DWORD /d 1 /f

> RESTART PC
