#!/bin/bash
./build.sh
near delete greendao-1.testnet greendao-1.testnet;
near login;
./deploy.sh