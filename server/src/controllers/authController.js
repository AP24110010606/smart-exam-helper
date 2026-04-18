const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { userResponse } = require('../utils/userResponse');
const { avatarDir } = require('../middleware/avatarUpload');

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'student',
      avatarUrl: '',
    });
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  res.json({ user: userResponse(req.user) });
}

/**
 * PATCH /api/auth/profile — name, email, avatarUrl (e.g. sample avatar path)
 */
async function updateProfile(req, res) {
  try {
    const { name, email, avatarUrl } = req.body;
    const updates = {};
    if (name !== undefined) {
      const n = String(name).trim();
      if (!n) return res.status(400).json({ message: 'Display name cannot be empty.' });
      updates.name = n;
    }
    if (email !== undefined) {
      const e = String(email).trim().toLowerCase();
      if (!e) return res.status(400).json({ message: 'Email cannot be empty.' });
      const taken = await User.findOne({ email: e, _id: { $ne: req.user._id } });
      if (taken) return res.status(400).json({ message: 'That email is already in use.' });
      updates.email = e;
    }
    if (avatarUrl !== undefined) {
      updates.avatarUrl = String(avatarUrl).trim();
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Provide name, email, or avatarUrl to update.' });
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ user: userResponse(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update profile.' });
  }
}

/**
 * PATCH /api/auth/password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not change password.' });
  }
}

/**
 * POST /api/auth/avatar — multipart field "avatar"
 */
async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded. Use field name "avatar".' });
    }
    const user = await User.findById(req.user._id);
    const prev = user.avatarUrl || '';
    if (prev.startsWith('/uploads/avatars/')) {
      try {
        const oldFile = path.join(avatarDir, path.basename(prev));
        if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      } catch (_) {
        /* ignore */
      }
    }
    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    res.json({ user: userResponse(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not save avatar.' });
  }
}

module.exports = { register, login, me, updateProfile, changePassword, uploadAvatar };
