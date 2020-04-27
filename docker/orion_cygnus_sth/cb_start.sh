rm -rf ../../../orion

docker start fiware-tutorial
docker start fiware-sth-comet
docker start fiware-cygnus
docker start fiware-iot-agent
docker start fiware-orion
docker start db-mongo