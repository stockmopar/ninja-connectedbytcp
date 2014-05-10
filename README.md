ninja-connectedbytcp
====================

Do this for a new install or if connectedbytcp has changed.

Note: This will take about 10 minutes to install.

```sh

sudo stop ninjablock

cd /opt/ninja/drivers

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git
cd ninja-connectedbytcp
sudo npm install

sudo start ninjablock

```

This is faster when you already have a version installed and connectedbytcp hasn't changed.

The below scripts are what I have been using to update my ninja driver after I have already installed the nodejs driver.

```sh

sudo stop ninjablock

cd /opt/ninja/drivers
mv ninja-connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

mv tmp ninja-connectedbytcp/node_modules

cd /opt/ninja
node client.js

```

I am still working on a faster way to update both the connectedbytcp module and ninja-connectedbytcp module. The below currently does not work!
```sh

cd /opt/ninja/drivers

mv ninja-connectedbytcp/node_modules/connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

mkdir ninja-connectedbytcp/node_modules/
cd ninja-connectedbytcp/node_modules/
git clone https://github.com/stockmopar/connectedbytcp.git

cd /opt/ninja/drivers
mv tmp ninja-connectedbytcp/node_modules/connectedbytcp/node_modules

cd /opt/ninja
node client.js

```
