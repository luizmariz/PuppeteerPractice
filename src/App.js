const puppeteer = require('puppeteer');
const Medium = require('./references/Medium');
const airtable = new(require('./api/AirtableAPI'))('');

class App {
	async execute() {
		const frameworks = await airtable.getFrameworkRecords();
		const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();
		
		
		console.log(frameworks)

		for (let i = 0; i < frameworks.length; i++){
			console.log("pesquisando por" + frameworks[i].name + "no Medium");
			this.medium = new Medium( page, frameworks[i].id, frameworks[i].name );
			await this.medium.search();
		}
		
  	await browser.close();
	}
}

module.exports = App;