const userRoutes = require('./users');
const accountRoutes = require('./accounts');
const transRoutes = require('./transactions');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/accounts', accountRoutes);
  app.use('/transactions', transRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;