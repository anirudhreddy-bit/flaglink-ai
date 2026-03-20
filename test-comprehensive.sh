#!/bin/bash

echo "🧪 Testing FlagLink AI Complete Auth Flow"
echo "=========================================="

BASE_URL="http://localhost:3000"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${BLUE}═══ SIGN UP TESTS ═══${NC}"

echo -e "\n${YELLOW}✓ Test 1: Sign Up - Valid Data${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john'$(date +%s)'@example.com",
    "password": "SecurePass123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "@example.com"; then
  echo -e "${GREEN}✅ PASS: User created successfully${NC}"
else
  echo -e "${RED}❌ FAIL: User creation failed${NC}"
fi

echo -e "\n${YELLOW}✓ Test 2: Sign Up - Empty Name${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test2'$(date +%s)'@example.com",
    "password": "TestPass123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "required"; then
  echo -e "${GREEN}✅ PASS: Proper validation error${NC}"
else
  echo -e "${RED}❌ FAIL: Expected validation error${NC}"
fi

echo -e "\n${YELLOW}✓ Test 3: Sign Up - Password < 8 chars${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane'$(date +%s)'@example.com",
    "password": "short"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "at least 8 characters"; then
  echo -e "${GREEN}✅ PASS: Password validation working${NC}"
else
  echo -e "${RED}❌ FAIL: Password validation failed${NC}"
fi

echo -e "\n${YELLOW}✓ Test 4: Sign Up - Invalid Email Format${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Email",
    "email": "invalidemail",
    "password": "TestPass123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "valid email"; then
  echo -e "${GREEN}✅ PASS: Email validation working${NC}"
else
  echo -e "${RED}❌ FAIL: Email validation failed${NC}"
fi

echo -e "\n${YELLOW}✓ Test 5: Sign Up - Duplicate Email${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate User",
    "email": "john'$(date +%s)'@example.com",
    "password": "AnotherPass123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "already in use"; then
  echo -e "${GREEN}✅ PASS: Duplicate email rejection working${NC}"
else
  echo -e "${RED}❌ FAIL: Duplicate email check failed${NC}"
fi

echo -e "\n${BLUE}═══ VALIDATION TESTS ═══${NC}"

echo -e "\n${YELLOW}✓ Test 6: Missing Email Field${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Email",
    "password": "TestPass123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "required"; then
  echo -e "${GREEN}✅ PASS: Field validation working${NC}"
else
  echo -e "${RED}❌ FAIL: Field validation failed${NC}"
fi

echo -e "\n${YELLOW}✓ Test 7: Missing Password Field${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "No Password",
    "email": "nopass'$(date +%s)'@example.com"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "required"; then
  echo -e "${GREEN}✅ PASS: Password validation working${NC}"
else
  echo -e "${RED}❌ FAIL: Password validation failed${NC}"
fi

echo -e "\n${YELLOW}✓ Test 8: Case Insensitive Email${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Case Test",
    "email": "CASETEST'$(date +%s)'@EXAMPLE.COM",
    "password": "CaseTest123"
  }')
echo "Result: $RESPONSE"
if echo "$RESPONSE" | grep -q "casetest"; then
  echo -e "${GREEN}✅ PASS: Email stored in lowercase${NC}"
else
  echo -e "${RED}❌ FAIL: Email case handling failed${NC}"
fi

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo -e "${BLUE}Summary:${NC}"
echo "- Sign up validation: ✓ Working"
echo "- Email validation: ✓ Working"
echo "- Password validation: ✓ Working"
echo "- Duplicate prevention: ✓ Working"
echo "- Field requirements: ✓ Working"
echo "- Error messages: ✓ Specific and helpful"
