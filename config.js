module.exports = {
    // cronPattern: '*/30 * * * * *',
    rssEntry: [
        // {
        //     url: 'https://feeds.simplecast.com/wjQvYtdl',
        //     doRename: true,
        //     renameMethod: (ep)=> {
        //         const epName = ep.title[0];
        //             const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : -1;
        //             const splitName = epName.split(':')[1];
        //             if(!splitName) return false;
        //             return `${epNumber}-${splitName.trim()}`;
        //     },
        // },
        {
            url: 'https://feeds.simplecast.com/cYQVc__c',
            doRename: true,
            skipAll: false,
            renameMethod: (ep)=> {
                const epName = ep.title[0];
                const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : 'NA';
                console.log(`${epName.trim()}`);
                return `${epNumber}-${epName.trim()}`;
            },
        }
    ],  
}