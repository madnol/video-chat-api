const validationMiddleware = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(",");
      const err = new Error(message);
      err.code = 400;
      next(err);
    }
  };
};

const test = () => {};

module.exports = { validationMiddleware, test };
