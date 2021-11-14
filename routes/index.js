const userRoutes = require('./users');
const accountRoutes = require('./accounts');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/accounts', accountRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;