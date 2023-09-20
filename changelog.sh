COMMIT_REF=THE_LAST_COMMIT_REF
VERSION=4.39.1 # without v
TOKEN=YOUR_TOKEN

# uncomment to verify the changelog without pushing
# curl --fail --request GET --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/10171280/repository/changelog" --data "branch=master&to=$COMMIT_REF&version=$VERSION&message=[skip ci] Add changelog for $VERSION"

# this pushes a new commit to master with updated changelog
curl --fail --request POST --header "PRIVATE-TOKEN: $TOKEN" "https://gitlab.com/api/v4/projects/10171280/repository/changelog" --data "branch=master&to=$COMMIT_REF&version=$VERSION&message=[skip ci] Add changelog for $VERSION"
