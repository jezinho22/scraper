import puppeteer from "puppeteer";
import express, { response } from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/", (request, response) => response.json("Welcome to my crib, bruh"));

// chart scraper
app.get("/chart", async (request, response) => {
	const url =
		// "https://en.wikipedia.org/wiki/Daryl_Sutch"
		// "https://www.google.com/search?q=norwich+events&oq=norwich+events&ibp=htl;events&rciv=evn#fpstate=tldetail&htivrt=events&htidocid=L2F1dGhvcml0eS9ob3Jpem9uL2NsdXN0ZXJlZF9ldmVudC8yMDIzLTExLTEwfF8xODM4NTEwODU3MzAzOTc0MTIwMA%3D%3D"
		"https://www.officialcharts.com/charts/singles-chart/";

	// set up connection to page
	const browser = await puppeteer.launch({});
	const page = await browser.newPage();
	await page.goto(url);

	// scrape data
	const chart = await page.evaluate(() => {
		console.log("Hiya");
		const chartItems = document.querySelectorAll(
			".chart-item-content.relative.flex.w-full"
		);
		const positions = document.querySelectorAll("div.position");
		// console.log(positions);
		const titles = document.querySelectorAll(
			"a.chart-name.font-bold.inline-block span:nth-child(2)"
		);
		const artists = document.querySelectorAll(
			"a.chart-artist.text-lg.inline-block"
		);

		// create array of objs using scraped data to send as response
		const chartArray = [];
		for (let i = 0; i < titles.length; i++) {
			const x = {
				Position: positions[i].textContent.trim(),
				Title: titles[i].textContent.trim(),
				Artist: artists[i].textContent.trim(),
			};
			chartArray.push(x);
		}
		return chartArray;
	});
	// return response
	response.json(chart);
	// close connection
	await browser.close();
});

app.listen(PORT, () => console.log(`It's working! Running on PAUGHT 8080`));
