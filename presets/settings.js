function defaultTo(a, b) {
    if(a == undefined) {
        a = b
    }
    return a
}
class store{
    constructor(name, setMethod, getMethod) {
        this.get = getMethod
        this.set = setMethod
        store.__proto__[name] = this
    }
    static{
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
        new store(
            "archive",
            (data) => {},
            () => {}
        )
        new store(
            "timeStamp",
            (data) => {},
            () => {}
        )
    }
}
export {store, defaultTo}