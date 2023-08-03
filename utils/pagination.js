const paginate = async (model, perPage, page) => {
  const totalItems = await model.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);

  const results = await model
    .find()
    .skip(perPage * (page - 1))
    .limit(perPage);

  return {
    results,
    totalPages,
    currentPage: page,
    totalItems,
  };
};

module.exports = {
  paginate,
};
