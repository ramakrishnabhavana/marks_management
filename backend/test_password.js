import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect("mongodb://127.0.0.1:27017/marks_management");

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  passwordHash: String,
  role: String
}));

const user = await User.findOne({ username: '160123737141' });
console.log('User found:', user ? user.username : 'No user');
console.log('Stored hash:', user.passwordHash);

if (user) {
  const isValid = await bcrypt.compare('160123737141', user.passwordHash);
  console.log('Password valid:', isValid);

  // Let's also check what the hash was created from
  const saltRounds = 10;
  const testHash = await bcrypt.hash('160123737141', saltRounds);
  console.log('Expected hash for 160123737141:', testHash);

  const isValidWithTest = await bcrypt.compare('160123737141', testHash);
  console.log('Test hash valid:', isValidWithTest);

  // Check if the stored hash matches a hash of something else
  const possiblePasswords = ['160123737141', 'AMJA MAITHILI', 'amja maithili', 'password', '123456'];
  for (const pwd of possiblePasswords) {
    const isMatch = await bcrypt.compare(pwd, user.passwordHash);
    if (isMatch) {
      console.log('Password matches:', pwd);
      break;
    }
  }

  // Let's try to decode the hash to see what it was created from
  // The hash starts with $2a$10$ which means bcrypt with 10 rounds
  // Let's try hashing with different salts to see if we can find the original
  console.log('Hash analysis:');
  console.log('Hash starts with:', user.passwordHash.substring(0, 7));
  console.log('Salt extracted:', user.passwordHash.substring(7, 29));

  // Try hashing the password with the same salt
  const salt = user.passwordHash.substring(0, 29); // $2a$10$ + salt
  const hashedAgain = await bcrypt.hash('160123737141', salt);
  console.log('Re-hashed with same salt:', hashedAgain);
  console.log('Matches original:', hashedAgain === user.passwordHash);
}

process.exit();
