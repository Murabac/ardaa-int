// Utility script to generate password hash
// Run with: npx ts-node src/utils/generate-password-hash.ts

import bcrypt from 'bcryptjs'

async function generateHash() {
  const password = process.argv[2] || 'admin123'
  const hash = await bcrypt.hash(password, 10)
  console.log('Password:', password)
  console.log('Hash:', hash)
}

generateHash()


