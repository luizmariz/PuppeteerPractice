const puppeteer = require('puppeteer');
const Medium = require('./references/Medium');
const dotenv = require('dotenv');

dotenv.config();

const airtable = new(require('./api/AirtableAPI'))(process.env.AIRTABLE_KEY);

class App {
	async execute() {
		const frameworks = await airtable.getFrameworkRecords();
		const browser = await puppeteer.launch({headless: true});
		
		for (let i = 16; i < frameworks.length; i++){
			let page = await browser.newPage();
			await page.setBypassCSP(true);
			console.log("pesquisando por " + frameworks[i].name + " no Medium");
			this.medium = new Medium( page, frameworks[i].id, frameworks[i].name );
			await this.medium.search();
			page.close();
		}
		
  	await browser.close();
	}
}

module.exports = App;