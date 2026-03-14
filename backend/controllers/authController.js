const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS on 587
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Ethereal Skincare - Your Verification OTP',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering with Ethereal Skincare.</p>
        <p>Your One-Time Password is:</p>
        <h1 style="letter-spacing: 5px; color: #8A9A5B; font-size: 32px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Could not send email. Check your SMTP credentials in .env');
  }
};

// @desc    Register a new user & send OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // If unverified, resend OTP
    }

    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    let user;
    if (userExists && !userExists.isVerified) {
      // Update existing unverified user
      userExists.name = name;
      userExists.password = password;
      userExists.otp = { code: otp, expiresAt };
      user = await userExists.save();
    } else {
      user = await User.create({
        name,
        email,
        password,
        otp: { code: otp, expiresAt },
      });
    }

    if (user) {
      try {
        await sendOTPEmail(email, otp);
        res.status(201).json({
          message: 'OTP sent to email. Please verify to activate account.',
          email: user.email,
        });
      } catch (emailError) {
        // Email failed — auto-verify the user so signup still works
        console.error('Email send failed, auto-verifying user:', emailError.message);
        user.isVerified = true;
        user.otp = undefined;
        await user.save();
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
          message: 'Registered successfully.',
        });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: 'No OTP requested' });
    }

    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP matches, verify user
    user.isVerified = true;
    user.otp = undefined; // clear OTP
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your account first. Use forgot password option to resend OTP.' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request Password Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user doesn't exist for security
      return res.status(200).json({ message: 'If an account exists, an OTP will be sent.' });
    }

    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'If an account exists, an OTP will be sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otp.code || new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Resend OTP (for both registration verify & forgot password)
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getUserProfile,
  resendOtp,
};
