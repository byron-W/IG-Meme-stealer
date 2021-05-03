const prompt = require('prompt-sync')({ sigint: true });
const superagent = require('superagent');
const download = require('download');

async function main() {
	let link;
	while (link != "quit") {
		console.log(`--------Link--------`);
		link = prompt("Enter link: ");
		var URL, ID;
		if (link.substring(0, 1) == "!") { //get from raw url
			const bruh = new Date(Date.now())
			var URL, ID;
			ID = `${bruh.getMonth() + 1}_${bruh.getDate()}_${bruh.getFullYear()} + ${Math.floor(Math.random() * 100)}`
			if (link.substring(1, 2) === "!")
				ID += ".mp4";
			else if (link.substring(1, 2) === "@")
				ID += ".png";
			else
				continue;
			URL = link.substring(2)
		} else if (link.substring(0, 1) === "#") { //group of videos
			let find = parseInt(link.substring(1, 2))
			link = link.substring(2);
			link += "?__a=1";
			const { body } = await superagent
				.get(link).catch(err => {
					link = prompt("Private account :( ");
				});
			try {
				let base = body.graphql.shortcode_media.edge_sidecar_to_children.edges[find - 1].node
				if (base.is_video === true) {
					URL = base.video_url;
					ID = base.id + ".mp4";
				} else {
					URL = base.display_url;
					ID = base.id + ".png";
				}
			} catch (err) {
				console.log(err)
				continue;
			}
		} else { //single post
			link += "?__a=1";
			const { body } = await superagent
				.get(link).catch(err => {
					link = prompt("Private account :( ");
				});
			try {
				if (body.graphql.shortcode_media.is_video === true) {
					URL = body.graphql.shortcode_media.video_url;
					ID = body.graphql.shortcode_media.id + ".mp4";
				} else {
					URL = body.graphql.shortcode_media.display_url;
					ID = body.graphql.shortcode_media.id + ".png";
				}
			} catch (err) {
				console.log("Video didn't work, use raw:\n" + link);
				continue;
			}
		}
		await download(URL, 'C:/Users/oo/Pictures/Locker', { filename: `${ID}` });
		await new Promise(resolve => setTimeout(resolve, 3000));
		console.log(`Meme added`)
	}
}
async function test() {
	const link = "https://www.instagram.com/p/CGyiTW-FVK2/";
	const { body } = await superagent.get(link).catch(err => {
		console.log(err);
		return;
	})
	console.log(body)
}
//test();
main();