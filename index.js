const fs = require('fs')
const request = require('request')
let episodes = require('./episodes.json')

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
    })
}
async function main(){
    for(let i = 0; i < episodes.length; i -=- 1){
        const ep = episodes[i];
        console.log(`fetching: ${ep.episode}`);
        const episodeDirName = (ep.title[0] || ep.title || 'UNKNOWN');
        if(ep.enclosure && ep.enclosure['@url']){
    
            if(fs.existsSync(`downloads/${episodeDirName}`)){
                console.info('Episode exists, skipping...');
            }else{
                fs.mkdirSync(`downloads/${episodeDirName}`);
        
                console.log('fetching audio...');
                await download(ep.enclosure['@url'], `downloads/${episodeDirName}/${String(episodeDirName).replace(/ /g, '_')}.mp3`);
                console.log('✅ Done!')
            }
    
        }else{
            console.error(`No url for episode: ${ep.episode}`);
        }
    }
}

main();