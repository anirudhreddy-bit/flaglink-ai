#!/bin/bash

echo "🧪 Testing FlagLink AI Auth System"
echo "=================================="

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\n${YELLOW}Test 1: Sign Up - Valid Data${NC}"
echo "Sending: name=Test User, email=test@example.com, password=testpass123"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }')
echo "Response: $SIGNUP_RESPONSE"

echo -e "\n${YELLOW}Test 2: Sign Up - Missing Email${NC}"
echo "Sending: name=Another User, password=testpass123 (NO EMAIL)"
MISSING_EMAIL=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "password": "testpass123"
  }')
echo "Response: $MISSING_EMAIL"

echo -e "\n${YELLOW}Test 3: Sign Up - Invalid Email${NC}"
echo "Sending: name=Bad Email, email=notanemail, password=testpass123"
INVALID_EMAIL=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad Email",
    "email": "notanemail",
    "password": "testpass123"
  }')
echo "Response: $INVALID_EMAIL"

echo -e "\n${YELLOW}Test 4: Sign Up - Short Password${NC}"
echo "Sending: name=Test User, email=short@example.com, password=123 (TOO SHORT)"
SHORT_PASSWORD=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "short@example.com",
    "password": "123"
  }')
echo "Response: $SHORT_PASSWORD"

echo -e "\n${YELLOW}Test 5: Sign Up - Duplicate Email${NC}"
echo "Sending: name=Duplicate User, email=test@example.com (ALREADY EXISTS), password=testpass123"
DUPLICATE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate User",
    "email": "test@example.com",
    "password": "testpass123"
  }')
echo "Response: $DUPLICATE"

echo -e "\n${YELLOW}Test 6: Sign Up - Short Name${NC}"
echo "Sending: name=A, email=shortname@example.com, password=testpass123"
SHORT_NAME=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "shortname@example.com",
    "password": "testpass123"
  }')
echo "Response: $SHORT_NAME"

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo -e "Check the responses above for proper error messages"
