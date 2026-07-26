/**
 * Catch async errors and pass them to Express error handler
 * @param {Function} fn 
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
