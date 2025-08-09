#!/usr/bin/env node

/**
 * Production Deployment Script
 * Ensures all configurations are correct before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Production Deployment Checker\n');

// Check environment variables
const checkEnvFile = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('   Create a .env file with:');
    console.log('   VITE_API_URL=https://stock-flow-management-system.onrender.com/api');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiUrl = envContent.includes('VITE_API_URL=');
  
  if (!hasApiUrl) {
    console.error('❌ VITE_API_URL not found in .env file!');
    return false;
  }
  
  console.log('✅ Environment variables configured correctly');
  return true;
};

// Check _redirects file
const checkRedirects = () => {
  const redirectsPath = path.join(__dirname, 'public', '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.error('❌ _redirects file not found in public folder!');
    return false;
  }
  console.log('✅ _redirects file exists');
  return true;
};

// Check netlify.toml
const checkNetlifyConfig = () => {
  const netlifyPath = path.join(__dirname, 'netlify.toml');
  if (!fs.existsSync(netlifyPath)) {
    console.error('❌ netlify.toml not found!');
    return false;
  }
  console.log('✅ netlify.toml configuration exists');
  return true;
};

// Check package.json scripts
const checkPackageJson = () => {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const hasRequiredScripts = packageJson.scripts.build && packageJson.scripts.dev;
  if (!hasRequiredScripts) {
    console.error('❌ Required npm scripts missing!');
    return false;
  }
  
  console.log('✅ Package.json scripts configured');
  return true;
};

// Main check function
const runChecks = async () => {
  console.log('Running pre-deployment checks...\n');
  
  const checks = [
    checkEnvFile(),
    checkRedirects(),
    checkNetlifyConfig(),
    checkPackageJson()
  ];
  
  const allPassed = checks.every(check => check === true);
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All checks passed! Ready for deployment');
    console.log('\n📋 Next Steps:');
    console.log('1. Push your changes to GitHub: git push');
    console.log('2. Connect your repo to Netlify');
    console.log('3. Set build command: npm run build');
    console.log('4. Set publish directory: dist');
    console.log('5. Add environment variables in Netlify dashboard');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
};

// Run the checks
runChecks().catch(console.error);
