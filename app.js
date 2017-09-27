const fs = require('fs');
const express = require('express');
const passport = require('passport');
const path = require('path');
const app = express();
const models = path.join(__dirname, 'server/models');
const config = require('./server/config');

require('./server/models');
require('./server/core/passport')(passport);
require('./server/core/express')(app, passport);
require('./server/core/routes/index')(app, passport);


const server = app.listen(config.server.port, function() {
  console.info(`Express server listening on port ${server.address().port}`);
  require('./server/core/sockets').connect(server);
});
