if [ $TOKEN ]; then
  curl --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/10171280/jobs/artifacts/develop/download?job=build:androidproduction" -L -o apps/Minds.apk
else
  echo "Gitlab access token not provided. Provide it with TOKEN=YOUR_PRIVATE_TOKEN"
fi

