// This is a script to deploy an edge function to supabase.
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Function name to deploy
const functionName = process.argv[2];

if (!functionName) {
  console.error("Please provide a function name to deploy");
  console.log("Example: node deploy-function.js urdf-parser");
  process.exit(1);
}

// Path to the function directory
const functionDir = path.join(__dirname, "supabase", "functions", functionName);

// Check if the function directory exists
if (!fs.existsSync(functionDir)) {
  console.error(`Function ${functionName} not found in supabase/functions/`);
  process.exit(1);
}

console.log(`Deploying function ${functionName}...`);

try {
  // Deploy the function
  execSync(`npx supabase functions deploy ${functionName}`, {
    stdio: "inherit",
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
    },
  });
  console.log(`✅ Function ${functionName} deployed successfully!`);
} catch (error) {
  console.error(`❌ Failed to deploy function: ${error.message}`);
  process.exit(1);
}
