class anime{
    static{
        this.list = [];
        this.animeNamelist= [];
        function alfParse(str) {
            let stringSections = str.split("||");
            for (let index = 0; index < stringSections.length; index++) {
                let aniData = stringSections[index].split('  ');
                let seasonAndEpisode = aniData[2].split(' ');
                new anime(aniData[0], aniData[1], seasonAndEpisode[0], seasonAndEpisode[1]);
            };
        };
        function alfFormat() {
            let full = '';
            for (let index = 0; index < this.list.length; index++) {
                full = (index == 0)?this.list[index].alf():full + '||' + this.list[index].alf();
            };
            return full;
        };
        function alfview(download = true, readable = false) {
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
                    full = full + `${anime.list[index].alf()}||`
                }
                return full.slice(0, full.length - 2);
            } else if(download == false && readable == true) {
                let full = '';
                for (let index = 0; index < this.animeNamelist.length; index++) {
                    full = full + `\n${anime.list[index].alf()}||`
                }
                return full.slice(0, full.length - 2);
            } else {
                console.error("%cpurple warning: non-boolean value input", "color: BlueViolet")
            }
        };
        function log() {
            table(anime.list, ["anime", "episode", "season", "info"])
        };
        function find(animeRef) {
            let animeobj;
            let animepointer;
            switch (typeof(animeRef)) {
                case 'number':
                    animeobj = this.list[animeRef]
                    animepointer = animeRef
                    break;
                case 'string':
                    for (let index = 0; index < this.list.length; index++) {
                        if((this.animeNamelist[index].includes(animeRef.toLowerCase())) == true) {
                            animeobj = this.list[index];
                            animepointer = index
                            break;
                        };
                    }
                    break;
            }
            return [animeobj, animepointer];
        };
        function search(animeRef, episode = -1, season = -1, info = -1) {
            let animeobj = anime.find(animeRef)[0]
            if(episode != -1) {animeobj.episode = episode}
            if(info != -1) {animeobj.info = info}
            if(season != -1) {animeobj.season = season}
            store.anime.set(anime.alfFormat())
            return animeobj;
        };
        function del(animeRef) {
            let animepointer = anime.find(animeRef)[1]
            anime.list = [...anime.list.slice(0, animepointer),...anime.list.slice(animepointer + 1, anime.list.length)]
        }

        this.alfParse = alfParse
        this.alfFormat = alfFormat
        this.alfview = alfview

        this.log = log
        this.find = find
        this.search = search

        this.delete = del

        this.kick = function(animeRef) {
            let animepointer = find(animeRef)[1]
            del(animepointer)
        }

        if(store.anime.get() !== ''){alfParse(store.anime.get())};
    };
    constructor(animeName, info = 'watching', episode = 0, season = 1) {
        this.anime = animeName.trim();
        this.episode = Number(episode);
        this.season = Number(season);
        this.info = info;
        function incrementS(s = 1) {
            this.season = (s == 1)?this.season+ 1:s;
        }
        function incrementE(e = 1) {
            this.episode = (e == 1)?this.episode + 1:e;
        }
        function del() {
            anime.delete(this.anime)
        }
        this.s = incrementS
        this.e = incrementE
        this.del = del

        this.alias = [this.anime.toLowerCase()];
        if(this.anime.includes(String('AND{'))) {
            let r = this.anime.slice(this.anime.indexOf('AND{') + 4).toLowerCase().split(',').map((x) => {return x.trim()})
            this.anime = this.anime.slice(0, this.anime.indexOf("AND{")).trim()
            this.alias = [this.anime.toLowerCase(), ...r]
        };
        this.names = function() {
            if(this.alias.length > 1) {
                return this.anime + "AND{" + this.alias.slice(1)
            } else {
                return this.anime
            }
        }
        this.alf = function() {return this.names() + `  ${this.info}  ${this.episode} ${this.season}`};

        anime.list = [...anime.list, this];
        anime.animeNamelist = [...anime.animeNamelist, this.alias];
        store.anime.set(anime.alfFormat());
    };
};
export {anime}