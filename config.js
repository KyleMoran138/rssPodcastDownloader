module.exports = {
    renameMethod: (ep)=> {
        const epName = ep.title[0];
            const epNumber = ep['itunes:episode'] ? ep['itunes:episode'][0] : -1;
            const splitName = epName.split(':')[1];
            if(!splitName) return false;
            return `${epNumber}-${splitName.trim()}`;
    },
    doRename: true,

}