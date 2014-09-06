ninja-connectedbytcp
====================

Changelog


0.0.7

- Fixed bug which would cause duplicate status fetching loops

0.0.6

- Changed device state polling time to 3 seconds
- Modified amount and type of debugging

0.0.5

- Fixed issue to support single room
- Changed identifiers to include TCP to differentiate from Hue lights

0.0.1 to 0.0.4
- Initial Releases
- Lots of bug fixes

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

sudo start ninjablock

```

This is a faster way to update both the connectedbytcp module and ninja-connectedbytcp module but this only works if you have the modules installed already.
```sh

sudo stop ninjablock

cd /opt/ninja/drivers

mv ninja-connectedbytcp/node_modules/connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git

mkdir ninja-connectedbytcp/node_modules/
cd ninja-connectedbytcp/node_modules/
git clone https://github.com/stockmopar/connectedbytcp.git

cd /opt/ninja/drivers
mv tmp ninja-connectedbytcp/node_modules/connectedbytcp/node_modules

sudo start ninjablock

```

These are scripts to install from my develop branch

```sh

sudo stop ninjablock

cd /opt/ninja/drivers
mv ninja-connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone -b develop https://github.com/stockmopar/ninja-connectedbytcp.git

mv tmp ninja-connectedbytcp/node_modules

sudo start ninjablock

```

This is a faster way to update both the connectedbytcp module and ninja-connectedbytcp module but this only works if you have the modules installed already.
```sh

sudo stop ninjablock

cd /opt/ninja/drivers

mv ninja-connectedbytcp/node_modules/connectedbytcp/node_modules tmp

rm -rf ninja-connectedbytcp
git clone -b develop https://github.com/stockmopar/ninja-connectedbytcp.git

mkdir ninja-connectedbytcp/node_modules/
cd ninja-connectedbytcp/node_modules/
git clone -b develop https://github.com/stockmopar/connectedbytcp.git

cd /opt/ninja/drivers
mv tmp ninja-connectedbytcp/node_modules/connectedbytcp/node_modules

sudo start ninjablock

```

IF something is not working right execute this to run the client in the window to see if there are any errors.

```sh

sudo stop ninjablock

cd /opt/ninja
node client.js

```

Hit Control+C and then execute:

```sh

sudo start ninjablock

```

To View the NinjaBlocks log file execute:

```sh

cat /var/log/ninjablock.log

```
