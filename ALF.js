let anime_list = []

const alias_keyword = "AND{"

class anime{
    constructor(name, info = 'watching', ep = 0, season = 1, storage = anime_list) {
        let alias_index = name.lastIndexOf(alias_keyword)
        this.name = name.slice(
            0, 
            alias_index * Boolean(alias_index + 1)  
            // if alias_index is greater than -1 (in the string)
            // then take the index of the alias_keyword
            || name.length 
            //else, take the length of the name
        ).trim();
        this.info = info;
        this.ep = ep;
        this.season = season;
        
        
        this.aliases = name.slice(
            (
                alias_index * Boolean(alias_index + 1)  
                || 
                name.length
            ) + alias_keyword.length
        ).trim().split(',').map(alias=>alias.trim().toLowerCase())
        this.alias_formating = function() {
            if(this.aliases.length > 0) {
                return `${alias_keyword} ${this.aliases.join(', ')}`
            }
            return ""
        }
        

        this.s = function(season = null) {
            this.season = season ?? this.season + 1
            return this
        }
        this.e = function(episode = null) {
            this.ep = episode ?? this.ep + 1
            return this
        }
        this.i = function(info) {
            this.info = info
            return this
        }
        this.a = function(alias) {
            this.aliases = [...this.aliases, alias]
            return this
        }
        
        this.toALF = function() {
            return `${this.name}${this.alias_formating()}  ${this.info}  ${this.ep}  ${this.season}||`
        }

        storage.push(this)
    }
}

const ALF = {
    storage:{
        get:()=>{localStorage.getItem('anime_list')},
        set:write=>{localStorage.setItem('ALF',write)},
    },
    load:function(to_list = anime_list) {
        this.parse(this.storage.get(), to_list)
    },
    save:function(data = anime_list) {
        this.storage.set(this.stringify(data))
    },

    parse:function(data, to_list = anime_list) {
        data.split('||').map(line=>{
            let [name, info, ep, season] = line.split('  ')
            new anime(name, info, ep, season, to_list)
        })
    },
    stringify:function(data = anime_list) {
        return data.map(anime=>anime.toALF()).join('').slice(0, -2)
    },

    find:function(name_or_id, in_list = anime_list) {
        name_or_id = name_or_id.trim().toLowerCase()
        let index = undefined
        let anime = undefined
        switch(typeof name_or_id) {
            case 'string':
                for (const i in in_list) {
                    if(
                        (in_list[i].aliases.includes(name_or_id))
                        || 
                        (in_list[i].name.toLowerCase() == name_or_id)
                    ) {
                        index = i
                        anime = in_list[i]
                        break
                    }
                }
            break
            case 'number':
                index = name_or_id
                anime = in_list[name_or_id]
            break
            default:
                console.error('invalid input') //TODO: make this a proper error
            break
        }
        return [index, anime]
    },
    change:function(name, ep = null, season = null, info = null, from_list = anime_list) {
        let anime = this.find(name, from_list)[1]
        if(ep != null) anime.e(ep);
        if(season != null) anime.s(season);
        if(info != null) anime.i(info);
    },
    delete:function(name, from_list = anime_list) {
        let anime = this.find(name, from_list)[1]
        from_list.map(x => {
            if(x != anime) {
                return x
            }
        })
        
    },

    log:function(from_list = anime_list) {
        console.table(anime_list, ['name', 'info', 'ep', 'season'])
    },
}

const archive = {
    storage:{
        get:()=>{localStorage.getItem('archive')},
        set:write=>{localStorage.setItem('archive',write)},
    },
    undo:function(name, to_list = anime_list) {
        let intermediate_string = this.storage.get()
        intermediate_string.split('\n')
        .map(line=>{
            if(JSON.parse(line).name == name) {
                let {name, info, ep, season} = JSON.parse(line)
                new anime(name, info, ep, season, to_list)
                return ""
            }
            return line
        })
        .join('\n')
        this.storage.set(intermediate_string)
    },
    push:function archive(name_or_index, tags = [], rating, from_list = anime_list) {
        let [index, anime] = ALF.find(name_or_index, from_list)
        let archival = {}
        archival = anime
        archival.tags = tags
        archival.rating = rating
        ALF.delete(index, from_list)
        this.storage.set(this.storage.get + '\n' + JSON.stringify(archival))
    },
    log:function() {
        console.table(
            String(this.storage.get())
            .split('\n')
            .map(line=>JSON.parse(line))
        )
    }
}

const fav = {
    orites:{},
    storage:{
        get:()=>{localStorage.getItem('fav')},
        set:write=>{localStorage.setItem('fav',write)},
    },
    load:function() {
        this.storage.get().split('\n').map(name=>{
            this.orites[name] = name
            window[name] = ALF.find(name)[1]
        })
    },
    add:function(name, list = anime_list) {
        this.orites[name] = name
        window[name] = ALF.find(name, list)[1]
        this.storage.set(this.storage.get() + '\n' + name)
    },
    remove:function(name) {
        delete this.orites[name]
        delete window[name]
        this.storage.set(this.storage.get().replace(name, ''))
    },
    all:function(from_list = anime_list) {
        for (const anime in from_list) {
            this.add(from_list[anime].name)
        }
    },
}