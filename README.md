ninja-connectedbytcp
====================

Do this for a new install or if connectedbytcp has changed

```sh
cd /opt/ninja/drivers

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git
cd ninja-connectedbytcp
sudo npm install

cd /opt/ninja
node client.js
```

This is faster when you already have a version installed and connectedbytcp hasn't changed.

```sh
cd /opt/ninja/drivers
move ninja-connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

move tmp ninja-connectedbytcp/node_modules

cd /opt/ninja
node client.js
```
