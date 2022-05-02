function queued(name) {
    new anime(name, 'queued', 0, 0);
};
let waiting = function (name, season = 2) {
    new anime(name, 'waiting on', season, 0);
};
function watching(name, episode = 1){
    new anime(name, 'watching', 1, episode);
};
const oop = () => window.open('about:blank')
export {queued, waiting, watching, oop}
