const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI Terminal Colors for elegant logs
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}${CYAN}==================================================`);
console.log(`🔑 BusiMan ERP Database Role Promoter`);
console.log(`==================================================${RESET}\n`);

// 1. Parse server .env dynamically to get MONGO_URI
const envPath = path.join(__dirname, 'server', '.env');
let mongoUri = 'mongodb://localhost:27017/busiman'; // fallback

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGO_URI\s*=\s*(.+)/);
  if (match) {
    mongoUri = match[1].trim();
    console.log(`${GREEN}✔ Parsed database URI from server/.env: ${RESET}${mongoUri}`);
  }
} else {
  console.log(`${YELLOW}⚠ server/.env not found. Using default local MongoDB URI: ${RESET}${mongoUri}`);
}

// Define inline Schema matching User.model.js
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    role: String,
    isActive: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Readline interface for prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  try {
    console.log(`${YELLOW}📡 Connecting to MongoDB...${RESET}`);
    await mongoose.connect(mongoUri);
    console.log(`${GREEN}✔ Connected successfully!${RESET}\n`);

    // Fetch existing users to help the developer see options
    const users = await User.find({}, 'name email role');
    if (users.length === 0) {
      console.log(`${YELLOW}⚠ No registered users found in the database.${RESET}`);
      console.log(`Please run the BusiMan client, click 'Create account', and register a user first.\n`);
      process.exit(0);
    }

    console.log(`${BOLD}Current Registered Users:${RESET}`);
    users.forEach((u, i) => {
      console.log(`  [${i + 1}] Name: ${u.name.padEnd(20)} | Email: ${u.email.padEnd(30)} | Role: ${BOLD}${u.role}${RESET}`);
    });
    console.log('');

    rl.question(`${BOLD}Enter the email address or the number [#] to promote to Admin: ${RESET}`, async (input) => {
      let targetEmail = input.trim().toLowerCase();

      // Check if user entered a selection index instead
      const idx = parseInt(targetEmail) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < users.length) {
        targetEmail = users[idx].email;
      }

      try {
        const user = await User.findOne({ email: targetEmail });
        if (!user) {
          console.log(`\n${RED}❌ Error: User with email "${targetEmail}" was not found.${RESET}`);
          process.exit(1);
        }

        console.log(`\nPromoting user ${BOLD}${user.name} (${user.email})${RESET}...`);
        
        user.role = 'admin';
        await user.save();

        console.log(`${BOLD}${GREEN}🎉 SUCCESS! User role updated to 'admin'.${RESET}`);
        console.log(`You can now log in using ${BOLD}${user.email}${RESET} and access all administrative capabilities (Inventory CRUD, Vendor/Client deletion, reports control).\n`);
        
        await mongoose.connection.close();
        process.exit(0);
      } catch (err) {
        console.error(`\n${RED}❌ Error performing update: ${err.message}${RESET}`);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error(`\n${RED}❌ Failed to connect to MongoDB: ${err.message}${RESET}`);
    process.exit(1);
  }
}

main();
