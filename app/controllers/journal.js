const journalService = require('../services/journal');

exports.findByParams = async (req, res) => {

  const response = await journalService.FindByParams(req);
  return res.status(response.statusCode).send(response.jsonBody);

};
