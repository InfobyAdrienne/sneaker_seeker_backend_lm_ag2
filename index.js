require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
var unirest = require("unirest");
var cors = require("cors");

app.use(cors());

app.get("/api", (incomingRequest, outgoingResponse) => {
  var rapidApiRequest = generateUnirestRequest(
    "https://v1-sneakers.p.rapidapi.com/v1/sneakers"
  );
  let filters = {
    limit: "40",
  };
  if (incomingRequest.query.brand !== undefined) {
    filters.brand = incomingRequest.query.brand;
  }
  if (incomingRequest.query.limit !== undefined) {
    filters.limit = incomingRequest.query.limit;
  }
  if (incomingRequest.query.gender !== undefined) {
    filters.gender = incomingRequest.query.gender;
  }
  if (incomingRequest.query.colorway !== undefined) {
    filters.colorway = incomingRequest.query.colorway;
  }
  rapidApiRequest.query(filters);

  rapidApiRequest.end(function (rapidApiResponse) {
    if (rapidApiResponse.error) throw new Error(rapidApiResponse.error);
    let shoes_with_img = rapidApiResponse.body.results.filter(
      (shoe) => shoe.media.thumbUrl !== null
    );
    let response = { results: shoes_with_img };
    outgoingResponse.send(response);
  });
});

app.get("/api/:id", (incomingRequest, outgoingResponse) => {
  var rapidApiRequest = generateUnirestRequest(
    `https://v1-sneakers.p.rapidapi.com/v1/sneakers/${incomingRequest.params.id}`
  );

  // rapidApiRequest.end(function (rapidApiResponse) {
  //   if (rapidApiResponse.error) throw new Error(rapidApiResponse.error);
  //   outgoingResponse.send(rapidApiResponse.body);
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function generateUnirestRequest(url) {
  var rapidApiRequest = unirest("GET", url);
  rapidApiRequest.headers({
    "x-rapidapi-host": "v1-sneakers.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    useQueryString: true,
    "Access-Control-Allow-Origin": "http://localhost:3000/",
    "Access-Control-Allow-Credentials": true,
  });
  return rapidApiRequest;
}
