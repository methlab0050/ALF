class fav{
    static{
        this.list = []
        this.autoAll = (store.favoriteAll.get() == undefined)?false:store.favoriteAll.get();
        store.favoriteAll.set(this.autoAll)
        function add(name) {
            new fav(name)
        }
        function extract(str) {
            let no = str.split(',')
            for (let index = 0; index < no.length; index++) {
                new fav(no[index])
            }
        }
        function all() {
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
        this.add = add
        this.extract = extract
        this.all = all
        this.delete = del
        this.remove = del
        this.del = del
        if(store.favorites.get() !== null){this.extract(store.favorites.get())};
        if(this.autoAll == true) {this.all()}
    }
    constructor(name) {
        if(anime.list[anime.find(name)[1]] !== undefined) {
            fav.list = [...fav.list, name]
            if(name == Number(name)) {name = 'n' + name}
            store.favorites.set(fav.list)
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
export {fav}