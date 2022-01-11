// This module is used to wrap the async functions to catch error
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}