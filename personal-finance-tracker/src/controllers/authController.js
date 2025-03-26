const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../config/logger");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      logger.warn(`Attempt to register with existing email: ${email}`);
      return res.status(400).send("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const savedUser = await user.save();
    logger.info(`New user registered: ${email}`);
    res.send(savedUser);
  } catch (err) {
    logger.error(`Error during registration: ${err.message}`);
    res.status(400).send(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(400).send("Email not found");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    logger.info(`User logged in successfully: ${email}`);
    res.header("Authorization", token).send({ token });
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);
    res.status(500).send("Error during login");
  }
};
