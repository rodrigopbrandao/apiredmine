const issueService = require('../services/issue');

exports.findByParams = async (req, res) => {

  const response = await issueService.FindByParams(req);
  return res.status(response.statusCode).send(response.jsonBody);

};
