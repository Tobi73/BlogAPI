import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
}, { versionKey: false });

Schema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    this.password = hash;
    return next();
  }
  return next();
});

Schema.methods.comparePassword = async function (password) {
  const matches = await bcrypt.compare(password, this.password);
  return matches;
};

export default mongoose.model('User', Schema);
