# apiredmine
A REST API to return data from a local Redmine SQL Server Database.
Edit app\config\app.config.js fuke with your credentials, for user Authentication on the endpoint \auth\ .

Requires a running SQL Server with Redmine structure of tables, stored procedures (both stored procedures at docs folder), etc.
Returns a maximum of 100 records by query.

Acess http://localhost:3000/swagger/v1/ for Swagger.

Requires .env file like below.

NODE_ENV=development

SQL_USER=sqluser

SQL_PASSWORD=password

SQL_DATABASE=database

SQL_INSTANCE=instance

SQL_SERVER=server

SQL_ENCRYPT=false

SQL_TRUSTED_CONNECTION=false



