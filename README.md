# ALF

yo so
ALF stands for anime list format
It stores three main parts; the name, info on the anime, and then it stores the season and episode together

> I plan to change this to account for alias names(like AOT instead of Attack On Titan) and 'parts'(like Jojo part 4)

Lists are stored in cookies, but can be downloaded as text files

### Static methods and properties

- #### anime.list
    A list containing all animes as objects

- #### anime.animeNamelist
    Contains all anime names for list updating purposes.

- #### anime.alfParse(string)
    This method takes in a string argument and parses it as ALF, outputting animes as objects
    * Takes in string as argument
    * No return value; constructs objects with anime data. *All anime data is stored in anime.list*


- #### anime.alfFormat()  
    This method uses the anime data from the anime.list property, and outputs a string in alf format.  
    * No arguments; input is taken from the anime list
    * Returns a string in ALF format

- #### anime.log()  
    Outputs the anime list in console as a table  
    * No arguments; input is taken from the anime list
    * No return value
    * Outputs a table of values in console, with the anime name, episode, season, and info of each and every anime

- #### anime.search(anime, episode?, season?, info?)  
    The anime.search method serves two purposes; firstly, to find and output anime information; secondly, to alter and update the anime information.  

    > The current version of ALF is designed for binge watchers who finish series quickly. An increment fucntion will be reintroduced in the future.  
  
    * The anime is a required argument, both strings as the name of the anime, and numbers as the index of the anime in the anime.list are accepted  
    * Episode, season, and info are optional requirements  
    * Returns anime data as an object  



### Constructed methods and properties
- #### this.anime  
    Stores anime name given in constructor
- #### this.episode  
    Stores episode number given in constructor, can be changed by use of anime.search() static property
- #### this.info  
    Stores info string given in constructor, can be changed by use of anime.search() static property
- #### this.season  
    Stores season given in constructor, can be changed by use of anime.search() static property
- #### this.alias  
    Stores all anime names/aliases of the object, from info to anime property; can be changed indirectly by use of anime.search() static property. 
    For more information, see [Adding aliases to anime object](https://github.com/methlab0050/ALF/edit/main/README.md#adding-aliases-to-anime-object).

### Adding animes to your list  
To add an anime to your list, you can use the following two methods:  
1. **Constructor method**
    new anime("name", "info", episode, season)

2. **ALF parse method**  
    anime.alfParse("anime  info  episode season")

    Make sure that:
    * There are *two* space between the name and info, and info and episode.
    * Info and the anime name do not include double spaces
    * There is only one space between episode and season
    * For adding multiple anime at a time using this method, add "||" as dividers

    Example: anime.alfParse("anime  info  episode season||another anime  information, once again  episode season")

### Adding aliases to anime object  
    To add aliases to an anime, add two back slashes at the end of your anime info, and then begin listing aliases, as seen below
    anime.alfParse("anime  info\\other, names, for, this, anime  episode season")
    new anime("name", "info\\anime names can have spaces, but not commas", episode, season)
