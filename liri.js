require("dotenv").config();
var keys = require("./keys.js");
//var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "Please select what you want to search:",
        choices: [
          "concert-this",
          "spotify-this-song",
          "movie-this",
          "do-what-it-says",
          "Exit"
        ]
      }
    ])
    .then(function(res) {
      //elaborate the question to ask
      let question = "Please enter the name of the ";
      switch (res.selection) {
        case "concert-this":
          question += "Artist/Band: ";
          break;
        case "spotify-this-song":
          question += "Song: ";
          break;
        case "movie-this":
          question += "Movie: ";
          break;
        case "do-what-it-says":
          readRandom();
          break;
        default:
          //function if the user choose exit
          return;
      }

      if (res.selection !== "do-what-it-says") {
        console.log(question);
        nextQuestion(question, res.selection);
      }
    });
}
//end of main menu

mainMenu();

//prompt the band, song or movie to be search
function nextQuestion(question, searchType) {
  inquirer
    .prompt([
      {
        type: "text",
        message: question,
        name: "answer"
      }
    ])
    .then(function(res) {
      //calling specific function to search api
      decision(searchType, res.answer);
    });
}

function decision(searchType, name) {
  //adding search if band, movie or song to ramdon file
  if (searchType !== "do-what-it-says") {
    const newSearch = `,${searchType} ${name}`;
    fs.appendFileSync(
      "random.txt",
      newSearch,
      (err = {
        if(err) {
          console.log(err);
        }
      })
    );
  }
  switch (searchType) {
    case "concert-this":
      searchConcert(searchType, name);
      break;
    case "spotify-this-song":
      searchSong(searchType, name);
      break;
    case "movie-this":
      searchMovie(searchType, name);
      break;
    default:
    // no fuctionality required by default
  }
}

function searchConcert(searchType, artist) {
  console.log(artist);
  axios
    .get(
      `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`
    )
    .then(function(response) {
      //built data object key name of artist searcher to store in the log.txt file
      var data = `{${searchType}${artist}":[`;

      //console all the events for the artist or band
      response.data.forEach(element => {
        //format date and time of event
        const dateOfEvent = moment(element.datetime).format("LLLL");
        //built
        data += `{"Name of Bands/Artists to Perform":"${element.lineup}",
      "Venue name":"["${element.venue.name}","${element.venue.city}","${
          element.venue.region
        }","${element.venue.country}"],
        "Date of event: "${dateOfEvent}"},`;

        console.log(
          `Name of the Band/Artists to perform: ${element.lineup.join(", ")}`
        );
        console.log(
          `Venue name: ${element.venue.name}, ${element.venue.city},
          ${element.venue.country}`
        );
        console.log(`Date of event ${dateOfEvent}`);
        console.log(
          "-----------------------------------------------------------------"
        );
      });

      data = data.substr(0, data.length - 1);
      data += "]},";
      saveLog(data);
    })
    .catch(error => {
      console.log(error);
      continueMenu();
    });
}

function searchSong(searchType, songToSearch) {
  spotify
    .search({ type: "track", query: songToSearch })
    .then(function(response) {
      //artists, song's name, link of the song, name of album
      //data added is an array of objects
      let data = `{"${searchType} ${songToSearch}":[`;

      response.tracks.items.forEach(element => {
        let artists = [];
        element.artists.forEach(singer => {
          console.log(`Artists Name ${singer.name}`);
          artists.push(singer.name);
        });

        console.log(`Song's Name: ${element.name}`);
        console.log(`Link of the Song: "${element.href}"`);
        console.log(`Name of Album: ${element.album.name}`);
        console.log("---------------------------------------------------");
        data += `{
          "artists":"${artists}",
          "Song's Name": "${element.name}",
          "Link of the Song":"${element.href}",
          "Name of Album":"${element.album.name}"
        },`;
      });

      data = data.substr(0, data.length - 1);
      data += "]},";
      saveLog(data);
    })
    .catch(err => {
      console.log(err);
      continueMenu();
    });
}

function searchMovie(searchType, movie) {
  axios
    .get(`https://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`)
    .then(function(response) {
      let data = "";

      //console.log(response.data);
      if (response.data !== null) {
        console.log(`Movie Title: ${response.data.Title}`);
        console.log(`Year Release: ${response.data.Year}`);
        console.log(`Imdb Rating: ${response.data.imdbRating}`);

        //response.data.Ratings.filter("")
        let rott = "";
        if (Object.values(response.data.Ratings).length > 1) {
          rott = Object.values(response.data.Ratings[1]).join(": ");
        } else {
          rott = "Rotten tomatoes: not rated yet";
        }

        console.log(rott);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Languages: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Main Cast: ${response.data.Actors}`);
        console.log(`------------------------------------------------------`);
        rott = rott.split(":");
        data = `{"${searchType} ${movie}":{
                "Movie Title": "${response.data.Title}"
                "Year Release": "${response.data.Year}",
                "Imdb Rating": "${response.data.imdbRating}",
                "${rott[0]}":"${rott[1]}",
                "Country": "${response.data.Country}",
                "Languages": "${response.data.Language}",
                "Plot": "${response.data.Plot}",
                "Main Cast": "${response.data.Actors}"
                },`;
      } else {
        console.log("movie not found");
      }

      saveLog(data);
    })
    .catch(err => {
      console.log(`Oh oh, something went wrong...${err}`);
      continueMenu();
    });
}

function readRandom(searchType) {
  fs.readFile("random.txt", "utf-8", function(error, data) {
    if (error) {
      console.log("error while reading file random.txt");
      return;
    }

    const dataArr = data.split(",");

    const randomSearch = Math.floor(Math.random() * dataArr.length);

    const sentence = dataArr[randomSearch];

    const newSearchType = sentence.substr(0, sentence.indexOf(" ")).trim();

    const newName = sentence
      .substr(sentence.indexOf(" "), sentence.length)
      .trim();

    decision(newSearchType, newName);
  });
}

function continueMenu() {
  inquirer
    .prompt({
      type: "confirm",
      name: "continue",
      message: "Back to Main Menu?"
    })
    .then(function(response) {
      if (response.continue) {
        mainMenu();
      } else {
        console.log("good bye");
        return;
      }
    });
}

function saveLog(file) {
  fs.appendFile("log.txt", file, function(err) {
    if (err) {
      console.log("error when trying to write on file");
    }
    continueMenu();
  });
}
