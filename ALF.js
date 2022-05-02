//Anime List Format(ALF 3.2.2)
const globalthis = this;
async function importModInOrder(...paths) {
    for (const path of paths) {
        const module = await import(path)
        for (const key in module) {
            globalthis.__proto__[key] = module[key]
        }
    }
}; 
importModInOrder(
    './presets/settings.js', 
    './main/anime.js', 
    './main/favorite.js', 
    './presets/shortcuts.js',
)
