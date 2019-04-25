const App = require('./App');
const server = require('./src/server/server');

const rogerio = new App;

const search = (thing) => {
  rogerio.execute(thing);
};

module.exports ={ search };

require('make-runnable');