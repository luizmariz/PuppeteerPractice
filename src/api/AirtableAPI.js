const Airtable = require('airtable');

class AirtableAPI {
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.base = new Airtable({apiKey: this.API_KEY}).base('appzOuGudjNGlZ8Jm');
  }

  createArtigoRecord( tit, desc, lin, fram) {
    this.base('Artigos').create({
      "TITULO": tit,
      "DESCRIÇÃO": desc,
      "URL": lin,
      "framework": fram,
    }, (err, record) => {
        if (err) { console.error(err); return; }
        console.log(record.getId());
    });
  }

  async getFrameworkRecords() {
    const recordsList = [];

    await new Promise( (resolve, reject) => {
      this.base('Frameworks').select({ 
        view: "Lista" 
        
      }).eachPage(function page(records, fetchNextPage) { 
        
        records.forEach(function(record) {
          recordsList.push({
            "name": record.get('NOME'),
            "id": record.id
          });
        });

        fetchNextPage();
  
      }, function done(err) {
        if (err) { console.error(err); return; }
        resolve("123")
      });
    });

  }
    
}

module.exports = AirtableAPI;