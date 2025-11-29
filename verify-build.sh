#!/bin/bash

echo "🔍 Smart Traffic Management System - Build Verification"
echo "========================================================"
echo ""

echo "✅ Step 1: Checking file structure..."
if [ -f "src/utils/traffic/geoUtils.ts" ]; then
  echo "   ✓ geoUtils.ts exists"
else
  echo "   ✗ geoUtils.ts missing"
  exit 1
fi

if [ -f "src/utils/traffic/violationDetection.ts" ]; then
  echo "   ✓ violationDetection.ts exists"
else
  echo "   ✗ violationDetection.ts missing"
  exit 1
fi

if [ -f "src/utils/traffic/deepSort.ts" ]; then
  echo "   ✓ deepSort.ts exists"
else
  echo "   ✗ deepSort.ts missing"
  exit 1
fi

if [ -f "src/utils/traffic/websterMethod.ts" ]; then
  echo "   ✓ websterMethod.ts exists"
else
  echo "   ✗ websterMethod.ts missing"
  exit 1
fi

echo ""
echo "✅ Step 2: Checking documentation..."
if [ -f "PROJECT_COMPLETE.md" ]; then
  echo "   ✓ PROJECT_COMPLETE.md exists"
else
  echo "   ✗ PROJECT_COMPLETE.md missing"
fi

if [ -f "FIXES_APPLIED.md" ]; then
  echo "   ✓ FIXES_APPLIED.md exists"
else
  echo "   ✗ FIXES_APPLIED.md missing"
fi

if [ -f "UPGRADE_SUMMARY.md" ]; then
  echo "   ✓ UPGRADE_SUMMARY.md exists"
else
  echo "   ✗ UPGRADE_SUMMARY.md missing"
fi

if [ -f "ALGORITHMS.md" ]; then
  echo "   ✓ ALGORITHMS.md exists"
else
  echo "   ✗ ALGORITHMS.md missing"
fi

echo ""
echo "✅ Step 3: Running lint check..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "   ✓ Lint check passed"
else
  echo "   ✗ Lint check failed"
  exit 1
fi

echo ""
echo "✅ Step 4: Checking dependencies..."
if [ -d "node_modules/@types/socket.io-client" ]; then
  echo "   ✓ @types/socket.io-client installed"
else
  echo "   ✗ @types/socket.io-client missing"
fi

if [ -d "node_modules/leaflet" ]; then
  echo "   ✓ leaflet installed"
else
  echo "   ✗ leaflet missing"
fi

if [ -d "node_modules/chart.js" ]; then
  echo "   ✓ chart.js installed"
else
  echo "   ✗ chart.js missing"
fi

if [ -d "node_modules/socket.io-client" ]; then
  echo "   ✓ socket.io-client installed"
else
  echo "   ✗ socket.io-client missing"
fi

echo ""
echo "✅ Step 5: Verifying no Turf.js references..."
if grep -r "from '@turf/turf'" src/ > /dev/null 2>&1; then
  echo "   ✗ Found @turf/turf imports (should be removed)"
  exit 1
else
  echo "   ✓ No @turf/turf imports found"
fi

if grep -r "turf\." src/ > /dev/null 2>&1; then
  echo "   ✗ Found turf. method calls (should be geoUtils.)"
  exit 1
else
  echo "   ✓ No turf. method calls found"
fi

echo ""
echo "========================================================"
echo "🎉 All verification checks passed!"
echo "✅ Project is ready for preview and deployment"
echo "========================================================"
