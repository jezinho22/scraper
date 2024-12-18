import puppeteer from "puppeteer";
import express, { response } from "express";
import cors from "cors";
import 'dotenv/config';
import fs from 'fs';

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

	const fortune = await page.evaluate((process, page)=>{
		// username += 'Hello'
		console.log(process.env.USERNAME)
		document.querySelector('#username').value = process.env.USERNAME
		document.querySelector('#password').value = process.env.PASSWORD
		document.querySelector('#loginbtn').click()
		// console.log(document.querySelector('.fortune-para').textContent)
	}, process, page)
	await page.waitForNavigation()

	const values = await page.evaluate(() => {
		const activities = document.querySelectorAll('.activityname a')
		const links = []
		for (let i = 0; i < activities.length; i++) {
			links.push({title: activities[i].textContent, link: activities[i].href})
		}
		return links
	})
	console.log(values)
	// extrxact instance id from link and add to this query url
	const viewsUrl = 'https://techeducators.moodlecloud.com/report/participation/index.php?id=36&instanceid=3435&timefrom=&roleid=5&action='

	await page.goto(values[2].link, {
		waitUntil: "networkidle2",
	  });
	
	const views = await page.evaluate(() => {
		document.querySelectorAll('.reporttable tr')
		// extract tr then .c0 and .c1

	})

	browser.close()

function readFile (filename) {
	// probably this
	const fileContents = fs.readFile('mynewfile1.txt', function(err, data) {
		return data.toString()
	})
	return 
}

function writeFile () {
	fs.writeFile('mynewfile1.txt', 'Wotcher content!', function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
}

	

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
