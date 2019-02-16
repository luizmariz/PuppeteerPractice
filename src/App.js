const puppeteer = require('puppeteer');
const Medium = require('./references/Medium');

class App {
	constructor() {
		this.medium = new Medium;
	}

	async execute() {
		const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();
		 
		await this.medium.search( page, "node" );
		await this.medium.scrollAndScrap(page);
	
  	await browser.close();
	}

}

module.exports = App;