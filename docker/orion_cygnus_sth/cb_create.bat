rd /S /Q ../../../orion

docker-compose --log-level ERROR -f docker-compose.yml -p fiware up -d --remove-orphans

pause