const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const msgInvalidCredentials = 'Invalid Credentials';

exports.checkAuth = async (reqBody) => {

  const response = {
    statusCode: 401, success: false, jsonBody: 'Invalid credentials',
  };

  try {

    if (reqBody === undefined || reqBody === null) {

      return response;

    }

    if (reqBody.username != appConfig.token.username || reqBody.password != appConfig.token.password)
    {
      return response;
    }

    const token = {};
    token.accessToken = jwt.sign(
      { username: reqBody.username },
      appConfig.token.secret,
      { expiresIn: (60 * appConfig.token.minutesExpiration) },
    );

    token.token_type = appConfig.token.tokenType;
    token.expires_in = 60 * appConfig.token.minutesExpiration;
    token.date_time_expiration = new Date(+new Date() + (60 * appConfig.token.minutesExpiration));
    response.statusCode = 200;
    response.success = true;
    response.jsonBody = token;

  } catch (error) {

    // eslint-disable-next-line no-console
    console.error(error);
    response.statusCode = 500;
    response.success = false;
    response.jsonBody = 'Internal Server Error';

  }

  return response;

};

// eslint-disable-next-line consistent-return
exports.verifyJWT = async (req, res, next) => {

  let bearerHeader;

  try {

    bearerHeader = req.headers.authorization.replace('Bearer ', '');

  } catch (error) {

    return res.status(401).json({ success: false, message: msgInvalidCredentials });

  }

  if (req.headers.authorization === undefined) {

    return res.status(401).json({ success: false, message: msgInvalidCredentials });

  }

  if (!bearerHeader) {

    return res.status(401).json({ success: false, message: msgInvalidCredentials });

  }


  try {
   
    const isTokenOK = await this.isTokenOK(req);

    if (!isTokenOK) {

      return res.status(401).json({ success: false, message: 'Token not OK' });

    }

  } catch (error) {

    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(401).json({ success: false, message: 'Internal Error' });

  }

  return next();

};

exports.isTokenOK = async (req) => {

  if (req.headers.authorization === undefined) {

    return false;

  }

  const bearerHeader = req.headers.authorization.replace('Bearer ', '');
  if (!bearerHeader) {

    return false;

  }

  jwt.verify(bearerHeader, appConfig.token.secret, (error, decoded) => {

    if (error) {

      // eslint-disable-next-line no-console
      console.error(error);
      return false;

    }
  });

  return true;

};