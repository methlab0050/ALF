//Anime List Format(ALF 3.1)
class anime{
    static{
        this.storage;
        this.list = [];
        this.animeNamelist= [];
        this.alfParse = function (str) {
            let stringSections = str.split("||");
            for (let index = 0; index < stringSections.length; index++) {
                let aniData = stringSections[index].split('  ');
                let seasonAndEpisode = aniData[2].split(' ');
                new anime(aniData[0], aniData[1], seasonAndEpisode[0], seasonAndEpisode[1]);
            };
        };
        this.alfFormat = function () {
            let full = '';
            for (let index = 0; index < this.animeNamelist.length; index++) {
                full = (index == 0)?this.list[index].alf():full + '||' + this.list[index].alf();
            };
            return full;
        };
        this.alfview = function (download = true, readable = false) {
            if(download == true) {
                let blob = new Blob([anime.alfFormat() + anime.alfview(false, true)], { type: "text" });
                let a = document.createElement('a');
                a.download = 'ALFstring.txt';
                a.href = URL.createObjectURL(blob);
                a.dataset.downloadurl = ["text", a.download, a.href].join(':');
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
            } else if(download == false && readable == false) {
                let full = '';
                for (let index = 0; index < this.animeNamelist.length; index++) {
                    full = full + `${anime.list[index].anime}  ${this.list[index].info}  ${this.list[index].episode} ${this.list[index].season}||`
                }
                return full.slice(0, full.length - 2);
            } else if(download == false && readable == true) {
                let full = '';
                for (let index = 0; index < this.animeNamelist.length; index++) {
                    full = full + `\n${anime.list[index].anime}  ${this.list[index].info}  ${this.list[index].episode} ${this.list[index].season}||`
                }
                return full.slice(0, full.length - 2);
            } else {
                console.error('purple warning: non-boolean value input')
            }
        };
        this.log = function () {
            table(anime.list, ["anime", "episode", "season", "info"])
        };
        this.search = function (animeRef, episode = -1, season = -1, info = -1) {
            let animeobj
            switch (typeof(animeRef)) {
                case 'number':
                    animeobj = this.list[animeRef]
                    break;
                case 'string':
                    for (let index = 0; index < this.list.length; index++) {
                        if((this.animeNamelist[index].includes(animeRef.toLowerCase())) == true) {
                            animeobj = this.list[index];
                            break;
                        };
                    }
                    break;
            }
            if(episode != -1) {animeobj.episode = episode}
            if(info != -1) {animeobj.info = info}
            if(season != -1) {animeobj.season = season}
            document.cookie = anime.alfFormat();
            return animeobj;
        };
        if(document.cookie !== ''){this.alfParse(document.cookie)};
    };
    constructor(animeName, info = 'watching', episode = 0, season = 1) {
        this.anime = animeName.trimStart();
        this.episode = Number(episode);
        this.season = Number(season);
        this.info = info;
        this.alf = function() {return `${this.anime}  ${this.info}  ${this.episode} ${this.season}`};
        this.alias = [this.anime.toLowerCase()]
        if(this.info.includes(String('\\'))) {
            let r = this.info.slice(this.info.indexOf('\\') + 1).toLowerCase().split(',').map((x) => {return x.trimEnd().trimStart()})
            this.alias = [...this.alias, ...r]
        };
        anime.list = [...anime.list, this];
        anime.animeNamelist = [...anime.animeNamelist, this.alias];
        document.cookie = anime.alfFormat();
    };
};
function queued(name) {
    new anime(name, 'queued', 0, 0);
};
function waiting(name, season = 2) {
    new anime(name, 'waiting on', season, 0);
};
function watching(name, episode = 1){
    new anime(name, 'watching', 1, episode);
};
