#!/bin/sh

# curl $1 \
#   -F operations='{ "query": "mutation ($file: Upload!) { uploadImage(file: $file) { uri filename mimetype encoding } }", "variables": { "file": null } }' \
#   -F map='{ "0": ["variables.file"] }' \
#   -F 0=@$2

curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxNTczNjA2Nn0.eRr-jcUVShEJ-q93Ba44PgJ7QyKJA8mBJqT7s6Nx-ME" $1 \
  -F operations='{ "query":"mutation ($name: String!, $lat: Float!, $lng: Float!, $image: Upload!) { post(name: $name, lat: $lat, lng: $lng, image: $image) { name imageUrl } }", "variables": { "image": null, "name": "Morro Jable Lighthouse", "lat": 28.046233745462683, "lng": -14.332994624867055 } }' \
  -F map='{ "0": ["variables.image"] }' \
  -F 0=@$2
# curl $1 \
#   -F operations='{ "query":"mutation ($userid: String!, $file: Upload!) { uploadUserAvatar(userid: $userid, file: $file) }", "variables": { "file": null, "userid": "abc1234" } }' \
#   -F map='{ "0": ["variables.file"] }' \
#   -F 0=@$2