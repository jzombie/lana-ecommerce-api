#!/bin/bash

# This script is only set up to test from outside of a Docker environment

docker-compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit
