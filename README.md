# rssPodcastDownloader
I wrote this just to download all of the MBMBAM episodes. I'll probably adapt it in the future to look directly at rss feeds. But for now you have to add a json file with all of the desired episodes
This hasn't been tested all too much but it works for me.

This is meant to be run as a command, but feel free to update the code. 
I've only tested it with two RSS urls from https://podcastaddict.com/

To get running up: 
1. Clone the repo
2. cd into the project
3. run `npm i`
4. Run the command `node index.js <PODCAST_RSS_URL> <DOWNLOAD_DIRECTORY_WITHOUT_TRAILING_FORWARD_SLASH>`

By defualt the script will use a renaming function for the episodes that I wrote in the config.js file.
So far the config file only takes two values. Those values are `renameMethod` and `doRename`. `renameMethod` is a function which is passed an episode object (more details upon request) and is expected to return a string or false.
If the method returns false, the download is skipped for that episode. The returned string will be the name of the downloaded episode. 
The `doRename` method is expected to be a boolean. If it's false the episodes will not be renamed using the `renameMethod` (now that I think about it, this doesn't have a default...)
