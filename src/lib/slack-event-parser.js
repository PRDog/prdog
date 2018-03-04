const parseSlackEvent = (req) => {
  return JSON.parse(unescape(req.body.payload));
};

module.exports = { parseSlackEvent };
