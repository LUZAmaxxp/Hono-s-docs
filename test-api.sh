#!/bin/bash

BASE_URL="http://localhost:3000"

echo "Testing user registration..."
curl -s -X POST $BASE_URL/register -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}'
echo -e "\n"

echo "Testing login..."
TOKEN=$(curl -s -X POST $BASE_URL/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpass"}' | jq -r '.token')
echo "Received token: $TOKEN"
echo -e "\n"

echo "Testing access to protected profile route with token..."
curl -s -X GET $BASE_URL/profile -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "Testing logout..."
curl -s -X POST $BASE_URL/logout
echo -e "\n"
