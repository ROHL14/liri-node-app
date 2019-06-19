# liri-node-app
## What is liri?
Liri is a node application that works in the terminal, it shows you a menu whit 5 options, the first 3 options realize a search in differents API, the 4 option does a random search, and the 5 option it is just for exit.

## How to run liri
To run liri it is necesary to execute the command node liri in the terminal of the main directory of the app:
![GitHub Logo](/images/runLiri.png)

## How liri works
1. After the comdand line is executed liri displays a menu with five choices from where the user can choose by using the up and down keys from the keyboard. If the user select 1 of the first 3 options it is ask for the name of the band/artist, movie or song that wants to search.
![GitHub Logo](/images/mainMenu.png)

2. If the user select the 4 option, liri reads the file named random.txt, ramdomly picks an element and according to the option read search in the respective API and display in the console the return data from the API.

3. The option Concert-This and Movie-This uses the npm package axios to request the data in the respective API and consoles the information retrieve as it is reflected in the next images.
![GitHub Logo](/images/concertThis.png)
![GitHub Logo](/images/movieThis.png)

4. In the spotify option, liri uses the npm package node-spotify-api, the use of this API requieres a personal api key and a secret key provided by spotify, this makes necesary the use of the npm package dotenv and the creation of a key.js file to save the values of the keys private when the app is uploaded to a github repository. The result of this option is also display in the console.
![GitHub Logo](/images/spotifyThis.png)

5. All the data that is console from the searches is also store in a file named log.txt, and the parameters of the search store in the file random.txt separated for commas, so later can be use in the 4 option of the menu.

6. To exit the app, the user can do it from the main menu, or after a search result is display the app gives the option to return to the main menu or if the user choose no then it will exit liri.

7. All the functionality of the app it is contain in the file liri.js, to understand how it works follow the flow of the functions starting with the function mainMenu().
