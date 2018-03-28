const excCatch = func => async (req, res, next) => {
  try {
    await func(req, res, next);
  } catch (e) {
    next(e);
  }
};

export default excCatch;
