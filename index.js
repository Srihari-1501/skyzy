// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";



const app = express();
const port = 3000;
const API_URL = "api.openweathermap.org/data/2.5/";
const yourAPIKey = "9deb2747b3e130ab007f49bac2721d5a";
var searchP;


// 3. Use the public folder for static files.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// 4. When the user goes to the home page it should render the index.ejs file.

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

function kelToC(kelvin) {
  return Math.round(kelvin - 273.15) ;
}

app.get("/",(req, res) => {
  res.render("index.ejs");
});

app.post('/search', async(req, res) => {
  searchP = req.body.searchPlace;
  console.log(searchP);
  try {
    const result = await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+searchP+"&appid=9deb2747b3e130ab007f49bac2721d5a");
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    let date = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    let currentDate = `${date}-${month}-${year}`;
    const time = `${hour}:${minute}`;
    const climate = result.data.weather[0].main;
    const temperature = kelToC(result.data.main.temp);

    const climateDetail = result.data.weather[0].description;

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const d = new Date();
    let day = weekday[d.getDay()]; 
    
    const humidity = result.data.main.humidity;
    const visibility =  result.data.visibility;

    console.log(result.data.main.temp_max);


    res.render("weather.ejs",
    { city: result.data.name,
      time : time,
      date : currentDate ,
      day : day,
      climateD: climateDetail,
      climate: climate,
      temp : temperature,
      humidity : humidity,
      vis: visibility/1000,
      country : result.data.sys.country,
      wind : result.data.wind.speed,
      maxT : kelToC(result.data.main.temp_min),
      minT : kelToC(result.data.main.temp_max),
      feelLike : kelToC(result.data.main.feels_like),
      icon : "http://openweathermap.org/img/w/" + result.data.weather[0].icon + ".png"
    }
    );

  } catch (error) {
    res.status(404).send(error.message);
  }
});

// 6. Listen on your predefined port and start the server.
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
  