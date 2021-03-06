const puppeteer = require('puppeteer');
const Medium = require('./src/references/Medium');
const dotenv = require('dotenv');

dotenv.config();

const airtable = new(require('./src/api/AirtableAPI'))(process.env.AIRTABLE_KEY);

class App {
	async execute(type) {
		const browser = await puppeteer.launch({headless: true});

		if (type === "framework") {
			const frameworks = await airtable.getFrameworkRecords();

			console.log("\nrogerio está pesquisando por frameworks...\n")

			for (let i = 0; i < frameworks.length; i++){
				let page = await browser.newPage();
				await page.setBypassCSP(true);
				console.log("\n---------------------------------------\npesquisando por " + frameworks[i].name + " no Medium\n---------------------------------------\n");
				this.medium = new Medium( page, frameworks[i].id, frameworks[i].name , "framework" );
				await this.medium.search();
				await page.close();
			}

		}

		if (type === "lib") {
			const libs = await airtable.getLibsRecords()

			console.log("\nrogerio está pesquisando por libraries...\n")

			for (let i = 0; i < libs.length; i++){
				let page = await browser.newPage();
				await page.setBypassCSP(true);
				console.log("\n---------------------------------------\npesquisando por " + libs[i].name + " no Medium\n---------------------------------------\n");
				this.medium = new Medium( page, libs[i].id, libs[i].name, "lib" );
				await this.medium.search();
				await page.close();
			}

		}

  	await browser.close();
	}
}

module.exports = App;