#!/usr/bin/env sh
# Params:
#  docker tag of the image to be pull and run.
#  target server name or IP
#
# Required environment variables (provided by GitLab group level Secret variables):
#  DEPLOYER_SSH_KEY
#  REGISTRY_TOKEN
#  REGISTRY_USER
#  REGISTRY_URL
#
# NB: Run this script from the root of the project.

set -e

DOCKER_TAG=$1
TARGET_HOST=$2
SSH_FLAGS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "$DEPLOYER_SSH_KEY" > keyfile
chmod 600 keyfile

cp ci/deploy/.env-$CI_ENVIRONMENT_NAME .env
echo "DOCKER_TAG=$DOCKER_TAG" >> .env
echo "REGISTRY_URL=$REGISTRY_URL" >> .env

ssh $SSH_FLAGS -t -i keyfile deployer@$TARGET_HOST "rm -rf /home/deployer/$DOCKER_TAG &> /dev/null;mkdir /home/deployer/$DOCKER_TAG"
scp $SSH_FLAGS -i keyfile -r ci/deploy/remote/* deployer@$TARGET_HOST:/home/deployer/$DOCKER_TAG/
scp $SSH_FLAGS -i keyfile .env deployer@$TARGET_HOST:/home/deployer/$DOCKER_TAG/
ssh $SSH_FLAGS -t -i keyfile deployer@$TARGET_HOST "sudo cp /home/deployer/$DOCKER_TAG/* /opt/eduviewer-frontend/ && sudo cp /home/deployer/$DOCKER_TAG/.env /opt/eduviewer-frontend/ && cd /opt/eduviewer-frontend && sudo ./run.sh $DOCKER_TAG $REGISTRY_USER $REGISTRY_TOKEN $REGISTRY_URL"
ssh $SSH_FLAGS -t -i keyfile deployer@$TARGET_HOST "rm -rf /home/deployer/$DOCKER_TAG"
