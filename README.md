ninja-connectedbytcp
====================

```sh
cd /opt/ninja/drivers
rm -rf ninja-connectedbytcp
git clone https://github.com/stockmopar/ninja-connectedbytcp.git
cd ninja-connectedbytcp
npm install

rm -rf connectedbytcp
git clone https://github.com/stockmopar/connectedbytcp.git
cd /opt/ninja
node client.js
