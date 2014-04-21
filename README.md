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
mv ninja-connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

mv tmp ninja-connectedbytcp/node_modules

cd /opt/ninja
node client.js

```

This is faster when you already have a version installed and connectedbytcp has changed (experimental)

```sh
cd /opt/ninja/drivers
mv ninja-connectedbytcp/node_modules/connectedbytcp/mode_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

cd ninja-connectedbytcp/node_modules/
git clone https://github.com/stockmopar/connectedbytcp.git

cd /opt/ninja/drivers
mv tmp ninja-connectedbytcp/node_modules/connectedbytcp/mode_modules

cd /opt/ninja
node client.js

```
