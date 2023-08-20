const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const jwtDecode = require("jwt-decode");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

const crypto = require("crypto");

//REGISTER
const register = async (req, res) => {
  const { email, name, password, lastName, picture } = req.body;

  // check email exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  isFirstAccount ? (req.body.role = "admin") : (req.body.role = "user");

  const { role } = req.body;

  const user = await User.create({
    name,
    lastName,
    email,
    password,
    picture,
    role,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Success! acount created",
  });
};
//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
//Google Login
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  const { email_verified, family_name, given_name, email, picture } =
    await jwtDecode(tokenId);
  if (!email_verified) {
    throw new CustomError.UnauthenticatedError("Google login failed");
  }
  console.log(email_verified, family_name, given_name, email, picture);
  let user = await User.findOne({ email });

  if (user.length === 0) {
    // If the user doesn't exist, create a new user account
    user = await User.create({
      name: given_name,
      lastName: family_name,
      email: email,
      picture: picture,
      role: "user",
      password: email + process.env.JWT_SECRET,
    });
  }
  const tokenUser = createTokenUser(user);
  // create refresh token
  let refreshToken = "";
  // check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//LOGOUT
const logout = async (req, res) => {
  const { userId } = req.params;
  await Token.findOneAndDelete({ user: userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

module.exports = {
  register,
  login,
  googleLogin,
  logout,
};
