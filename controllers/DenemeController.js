const osman = async (req, res) => {
  res.redirect(301, "http://localhost:3000/osman");
};
const deneme = async (req, res) => {
  res.redirect(301, "http://localhost:3000/deneme");
};

module.exports = { osman, deneme };
