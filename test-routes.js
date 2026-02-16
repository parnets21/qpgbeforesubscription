// Quick test to verify routes are loaded
const express = require('express');
const router = require('./Routes/ResultMakerRoutes');

console.log('Testing ResultMaker Routes...');
console.log('Router stack:', router.stack.length, 'routes loaded');

// List all routes
router.stack.forEach((r) => {
  if (r.route) {
    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
    console.log(`${methods} ${r.route.path}`);
  }
});

console.log('\nLooking for result-settings routes...');
const resultSettingsRoutes = router.stack.filter(r => 
  r.route && r.route.path.includes('result-settings')
);
console.log('Found', resultSettingsRoutes.length, 'result-settings routes');

console.log('\nTest complete!');
