//Anime List Format(ALF 3.2.1)
class store{
    constructor(name, setMethod, getMethod) {
        this.get = getMethod
        this.set = setMethod
        store.__proto__[name] = this
    }
}
function storeconfig() {
    //this is only in a function because normal brackets don't close in vscode
    new store(
        "anime",
        (data) => {localStorage.setItem("ALF", data)},
        () => {return localStorage.getItem("ALF")}
    )
    new store(
        "favorites",
        (data) => {localStorage.setItem("favorites", data)},
        () => {return localStorage.getItem("favorites")}
    )
    new store(
        "favoriteAll",
        (data) => {localStorage.setItem("favoriteAll", data)},
        () => {return localStorage.getItem("favoriteAll")}
    )
}
storeconfig()

class anime{
    static{
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
            for (let index = 0; index < this.list.length; index++) {
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
        this.log = function () {
            table(anime.list, ["anime", "episode", "season", "info"])
        };
        this.find = function(animeRef) {
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
        this.search = function (animeRef, episode = -1, season = -1, info = -1) {
            let animeobj = this.find(animeRef)[0]
            if(episode != -1) {animeobj.episode = episode}
            if(info != -1) {animeobj.info = info}
            if(season != -1) {animeobj.season = season}
            store.anime.set(anime.alfFormat())
            return animeobj;
        };
        this.delete = function (animeRef) {
            let animepointer = this.find(animeRef)[1]
            anime.list = [...anime.list.slice(0, animepointer),...anime.list.slice(animepointer + 1, anime.list.length)]
        }
  
        if(store.anime.get() !== null){this.alfParse(store.anime.get())};
    };
    constructor(animeName, info = 'watching', episode = 0, season = 1) {
        this.anime = animeName.trim();
        this.episode = Number(episode);
        this.season = Number(season);
        this.info = info;
        this.s = function(s = 1) {this.season = (s == 1)?this.season+ 1:s;}
        this.e = function(e = e) {this.episode = (e == 1)?this.episode + 1:e;}
        this.alf = function() {return this.names() + `  ${this.info}  ${this.episode} ${this.season}`};
        this.alias = [this.anime.toLowerCase()];
        this.names = function() {
            if(this.alias.length > 1) {
                return this.anime + "AND{" + this.alias.slice(1)
            } else {
                return this.anime
            }
        }
        if(this.anime.includes(String('AND{'))) {
            let r = this.anime.slice(this.anime.indexOf('AND{') + 4).toLowerCase().split(',').map((x) => {return x.trim()})
            this.anime = this.anime.slice(0, this.anime.indexOf("AND{")).trim()
            this.alias = [this.anime.toLowerCase(), ...r]
        };
        anime.list = [...anime.list, this];
        anime.animeNamelist = [...anime.animeNamelist, this.alias];
        store.anime.set(anime.alfFormat());
    };
};
class fav{
    static{
        this.list = []
        this.autoAll = (store.favoriteAll.get() == undefined)?false:store.favoriteAll.get();
        this.add = function(name) {
            new fav(name)
        }
        this.extract = function(str) {
            let no = str.split(',')
            for (let index = 0; index < no.length; index++) {
                new fav(no[index])
            }
        }
        this.all = function() {
            for (let index = 0; index < anime.list.length; index++) {
                new fav(index)
            }
        }
        function del(name) {
            if(fav.list.includes(name)) {
                let animepointer = fav.list.indexOf(name)
                fav.list = [...fav.list.slice(0, animepointer),...fav.list.slice(animepointer + 1, fav.list.length)]
                delete globalthis.__proto__[String(name).trim().replaceAll(' ', '_')]
                delete globalthis.__proto__[String(name).trim().replaceAll(' ', '')]
                delete globalthis.__proto__[anime.list[anime.find(name)[1]].anime.trim().replaceAll(' ', '_')]
                delete globalthis.__proto__[anime.list[anime.find(name)[1]].anime.trim().replaceAll(' ', '')]
                for (let index = 0; index < anime.list[anime.find(name)[1]].alias.length; index++) {
                    delete globalthis.__proto__[anime.list[anime.find(name)[1]].alias[index].trim().replaceAll(' ', '_')]
                    delete globalthis.__proto__[anime.list[anime.find(name)[1]].alias[index].trim().replaceAll(' ', '')]
                }
            }
            store.favorites.set(fav.list)
        }
        this.delete = del
        this.remove = del
        this.del = del
        if(store.favorites.get() !== null){this.extract(store.favorites.get())};
        if(this.autoAll == true) {this.all()}
    }
    constructor(name) {
        if(anime.list[anime.find(name)[1]] !== undefined) {
            fav.list = [...fav.list, name]
            store.favorites.set(fav.list)
            console.log()
            globalthis.__proto__[String(name).trim().replaceAll(' ', '_')] = anime.list[anime.find(name)[1]]
            globalthis.__proto__[String(name).trim().replaceAll(' ', '')] = anime.list[anime.find(name)[1]]
            globalthis.__proto__[anime.list[anime.find(name)[1]].anime.trim().replaceAll(' ', '_')] = anime.list[anime.find(name)[1]]
            globalthis.__proto__[anime.list[anime.find(name)[1]].anime.trim().replaceAll(' ', '')] = anime.list[anime.find(name)[1]]
            for (let index = 0; index < anime.list[anime.find(name)[1]].alias.length; index++) {
                globalthis.__proto__[anime.list[anime.find(name)[1]].alias[index].trim().replaceAll(' ', '_')] = anime.list[anime.find(name)[1]]
                globalthis.__proto__[anime.list[anime.find(name)[1]].alias[index].trim().replaceAll(' ', '')] = anime.list[anime.find(name)[1]]
            }
        }
    }
}

function queued(name) {
    new anime(name, 'queued', 0, 0);
};
function waiting(name, season = 2) {
    new anime(name, 'waiting on', season, 0);
};
function watching(name, episode = 1){
    new anime(name, 'watching', 1, episode);
};
const globalthis = this;