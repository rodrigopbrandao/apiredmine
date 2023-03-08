const appConfig = {
  api:
  {
    nuVersion: '1',
  },
  server:
  {
    port: 3000,
  },
  token: {
    username: 'username', password: 'password', minutesExpiration: 300, secret: 'secretBearerToken', tokenType: 'Bearer',
  },
  maxResults: 5,
};
module.exports = appConfig;
// mongodb+srv://userdb:<password>@cluster0.dvdhqdj.mongodb.net/?retryWrites=true&w=majority