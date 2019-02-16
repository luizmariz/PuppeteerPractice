const NoOverrideException = require('../exceptions/NoOverrideException')
//trying to do something near to an abstract class
class Reference {
  async search( page, query ) {
    try {
      throw new NoOverrideException;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reference;