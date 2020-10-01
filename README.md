# rssPodcastDownloader
This hasn't been tested all too much but it works for me. I've only tested it with two RSS urls from https://podcastaddict.com/

This is meant to be run as a cron job

To get running in the terminal: 
1. Clone the repo
2. Cd into the project
3. Run `npm i`
4. Update config.js (see below)
4. Run the command `node index.js`

To get running in Docker:
1. docker run -d --volume <path-to-config.js>:/downloader/config.js --volume <download-directory>:/downloader/downloads kmoran138/rss-podcast-downloader:latest
  
docker-compose.yml: _coming soon_

## Config.js
Here's the general layout of a config.js file
```
module.exports = {
  cronPattern: '*/30 * * * * *', <---- This is how frequently the script will attempt to fetch all podcasts (if a previous fetch is running it'll skip)
  rssEntry: [  <---- This is an array of all the podcasts you'd like to grab
    {
      url: '',  <---- Podcast RSS url
      doRename: true,  <---- when a podcast is downloaded run the renameMethod on the episode (default: true if renameMethod is defined)
      skipAll: false,  <---- skips downloading the actual episodes. It's like a dry run
      renameMethod: (ep)=> {  <---- This is a method called if defined and if doRename is set to true. It's expected to return a string which is the new episode name or false. If false is sent, the episode download will be skipped. The code in this example is for renaming a specific podcast. Each podcast is named differently so a different method for each podcast is required.
          const epName = ep.title[0];
          const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : 'NA';
          console.log(`${epName.trim()}`);
          return `${epNumber}-${epName.trim()}`;
      },
    },
  ],  
}

```

The `ep` parameter in the `renameMethod` is basically all of the data in the XML <item> element for the RSS feed. If you need more details, just do `console.log(ep); return false;` in the `renameMethod` and you'll get the object in the console.
