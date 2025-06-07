const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require("../services/authentication.js");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    salt: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageUrl: {
      type: String,
      default: '/image/default.png',
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// ✅ Static method for login + token generation
userSchema.static('matchPasswordAndGenrateToken', async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');

  const userProvidedHash = createHmac('sha256', user.salt)
    .update(password)
    .digest('hex');

  if (user.password !== userProvidedHash) {
    throw new Error('Incorrect password');
  }

  const token = createTokenForUser(user);
  return token;
});

const User = model('user', userSchema);
module.exports = User;
