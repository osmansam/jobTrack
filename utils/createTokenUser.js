const createTokenUser = (user) => {
  return {
    name: user.name,
    lastName: user.lastName,
    userId: user._id,
    picture: user.picture,
    role: user.role,
  };
};

module.exports = createTokenUser;
