const fs = require('fs');
const request = require('request');
const xml2js = require('xml2js');
const rssUrl = 'https://feeds.simplecast.com/wjQvYtdl';

const main = async () => {
    try{
        console.log('Fetching latest Rss...');
        await downloadLatestRss();
        console.log('Done');
        const data = await parseXmlIntoObject();
        await getPodcast(data);
        removeRssFile();
    }catch(err){
        console.error('There was an error', err);
    }
}

// Podcast data processing
const getPodcast = async (data) => {
    return new Promise((res, rej) => {
        const channel = addChannelHelperMethodsToObject(data);
        const folderPath = createPodcastFolder(channel);
        console.log(`Downloading "${channel.getName()}" to "${folderPath}"`);
        downloadAllEpisodes(folderPath, channel.item, (ep) => {
            const epName = ep.title[0];
            const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : -1;
            const splitName = epName.split(':')[1];
            if(!splitName) return false;
            return `${epNumber}-${splitName.trim()}`;
        });
        res();
    });
}

const createPodcastFolder = (channelObject) => {
    const channelName = channelObject.getName();
    const channelAuthorName = channelObject.getAuthor();
    const podcastFolderPath = `./downloads/${channelAuthorName}/${channelName}`;
    if(!fs.existsSync(channelName)){
        fs.mkdirSync(podcastFolderPath, {recursive: true});
    }
    return podcastFolderPath;
}

const addChannelHelperMethodsToObject = (obj) => {
    const returnObj = {...obj.rss.channel[0]};
    returnObj.getName = () => {
        return returnObj.title[0]|| "TITLE_NOT_FOUND";
    }
    returnObj.getAuthor = () => {
        return returnObj['itunes:author'][0]|| "AUTHOR_NOT_FOUND";
    }
    return returnObj;
}

const downloadAllEpisodes = async (downloadLocation, episodesArray, episodeRenameCallback) => {
    for(let i = 0; i < episodesArray.length; i -=- 1){
        const ep = episodesArray[i];
        const epEnclosure = ep.enclosure[0];
        const epUrl = epEnclosure['$'].url;
        const epName = ep.title[0];
        const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : -1;
        const epFormattedName = typeof episodeRenameCallback === 'function' ? episodeRenameCallback(ep) : epName;
        const skipEp = epFormattedName === false;
        const epPath = `${downloadLocation}/${epFormattedName}.mp3`;

        if(fs.existsSync(epPath)){
            console.log(`Episode: ${epNumber} is already at the path`);
        }else if(skipEp){
            console.log(`Skipping: ${epNumber}`);
        }else{
            console.log(`Downloading episode ${epFormattedName}`);
            await download(epUrl, epPath);
            console.log('Done!\n');
        }
        return;
    }
}

// File work? 
const downloadLatestRss = async () => {
    return new Promise(async (resolve, reject) => {

        if(fs.existsSync('.newestRss.xml')){
            removeRssFile();
        }

        try{
            await download(rssUrl, '.newestRss.xml');
            resolve();
        }catch(err){
            reject(err);
        }

    });
}

const parseXmlIntoObject = async () => {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile(__dirname + '/.newestRss.xml', function(err, data) {
                const parser = new xml2js.Parser();
                parser.parseString(data, function (err, result) {
                    if(err) reject(err);
                    resolve(JSON.parse(JSON.stringify(result)));
                });
            });
        }catch(err){
            reject(err);
        }
    });
}

const download = (url, path) => {
    return new Promise((resolve, reject) => {
        try{
            request.head(url, (err, res, body) => {
              request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', resolve)
            })
        }catch(err){
            reject(err);
        }
    });
}

const removeRssFile = () => {
    fs.unlinkSync('.newestRss.xml');
}

main();