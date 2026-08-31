/**
 * Password hash generator — run once on VPS to set ADMIN_PASSWORD_HASH in .env
 * Usage: npm run hash-password
 */
import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter the admin password you want to use: ', async (password) => {
  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters.');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log('\n✅ Add this line to your .env file:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  rl.close();
});
