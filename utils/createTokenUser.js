const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    lastName: user.lastName,
    userName: user.userName,
    role: user.role,
    email: user.email,
  };
};

module.exports = createTokenUser;
