import puppeteer from "puppeteer";
import express, { response } from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => response.json("Welcome to my crib, bruh"));

console.log('DotEnv: ', process.env.USERNAME)

// chart scraper
// app.get("/chart", async (request, response) => {
	const url =
		"https://techeducators.moodlecloud.com/course/view.php?id=36"
		// "https://www.google.com/search?q=norwich+events&oq=norwich+events&ibp=htl;events&rciv=evn#fpstate=tldetail&htivrt=events&htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDIzLTExLTEwfF8xODM4NTEwODU3MzAzOTc0MTIwMA%3D%3D"
		// "https://www.officialcharts.com/charts/singles-chart/";

	// set up connection to page
	const browser = await puppeteer.launch({});
	const page = await browser.newPage();
	
	await page.goto(url, {
		waitUntil: "networkidle2",
	  });

	// scrape data
	// const chart = await page.evaluate(() => {
	// 	console.log("Hiya");
	// 	const chartItems = document.querySelectorAll(
	// 		".chart-item-content.relative.flex.w-full"
	// 	);
	// 	const positions = document.querySelectorAll("div.position");
	// 	// console.log(positions);
	// 	const titles = document.querySelectorAll(
	// 		"a.chart-name.font-bold.inline-block span:nth-child(2)"
	// 	);
	// 	const artists = document.querySelectorAll(
	// 		"a.chart-artist.text-lg.inline-block"
	// 	);
	page.on('console', (msg) => {
		console.log('Get this my brethren:', msg.text());
	})
	// const username = process.env.USERNAME
	// const button = await page.evaluate(()=> {
	const fortune = await page.evaluate((process, page)=>{
		// username += 'Hello'
		console.log(process.env.USERNAME)
		document.querySelector('#username').value = process.env.USERNAME
		document.querySelector('#password').value = process.env.PASSWORD
		document.querySelector('#loginbtn').click()
		// console.log(document.querySelector('.fortune-para').textContent)
	}, process, page)
	await page.waitForNavigation()

	const activities = await page.$$('.activityname a')
	const values = await page.evaluate(activities => {
		const list = activities.map(activity => console.log(activity.getProperties()))
		// return list
		}, activities)

		console.log('New Page URL:', page.url());
		console.log(values)
		// page.type('#ageInput', '56');
		// page.click('#submit',)
		// const heading = await page.$('.fortune-para')
		// const text = await heading.textContent
		// console.log(text)
	
	// await page.type('#nameInput', 'Tim')
	// await page.type('#ageInput', '56');
	// await page.click('#submit',)

	// capture client console.log()

	browser.close()
	

// 		// create array of objs using scraped data to send as response
// 		const chartArray = [];
// 		for (let i = 0; i < titles.length; i++) {
// 			const x = {
// 				Position: positions[i].textContent.trim(),
// 				Title: titles[i].textContent.trim(),
// 				Artist: artists[i].textContent.trim(),
// 			};
// 			chartArray.push(x);
// 		}
// 		return chartArray;
// 	});
// 	// return response
// 	response.json(chart);
// 	// close connection
// 	await browser.close();
// });

app.listen(PORT, () => console.log(`It's working! Running on PAUGHT 8080`));
