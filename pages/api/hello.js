// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const jsonld = require('jsonld');
const axios = require('axios');
const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var convert = require('xml-js');

export default async (req, res) => {


  const urls = [
    {
        name: "Paris",
        url: "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=1368&facet=name&refine.is_installed=OUI"
    },
    {
        name:"Lille",
        url:"https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&rows=242"
    },
    {
        name: "Lyon",
        url: "https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=1.1.0&outputformat=GEOJSON&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171"
    },
    {
        name: "StEtienne",
        url: "https://saint-etienne-gbfs.klervi.net/gbfs/en/station_information.json"
    }
    
];


const urlsWeather = [
    {
        name: "Paris",
        url: "https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=dcf9521833af767bb716a06812acbba7&units=metric"
    },
    {
        name:"Lille",
        url:"https://api.openweathermap.org/data/2.5/weather?q=Lille&appid=dcf9521833af767bb716a06812acbba7&units=metric"
    },
    {
        name: "Lyon",
        url: "https://api.openweathermap.org/data/2.5/weather?q=Lyon&appid=dcf9521833af767bb716a06812acbba7&units=metric"
    },
    {
        name: "StEtienne",
        url: "https://api.openweathermap.org/data/2.5/weather?q=Saint-Etienne&appid=dcf9521833af767bb716a06812acbba7&units=metric"
    },
    
];

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var convert = require('xml-js');

let stations = []
var Paris = (response,responseW) => {
    response = JSON.parse(response);
    responseW = JSON.parse(responseW);
    let array = response.records;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].datasetid;
        let name = array[index].fields.name;
       
        let lat = array[index].geometry.coordinates[1];
        let lng = array[index].geometry.coordinates[0];
        
        let cycleAvailability = array[index].fields.numbikesavailable;
        let parkcapacity = array[index].fields.numdocksavailable;
        let temperature = Math.round(responseW.main.temp)
        let station = {id, name, lat, lng, bikeCapacity : cycleAvailability, parkCapacity : parkcapacity,temperature:temperature};
        stations.push(station);
    }
};

var Lille = (response,responseW) => {
    response = JSON.parse(response);
    responseW = JSON.parse(responseW);
    let array = response.records;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].datasetid;
        let name = array[index].fields.nom;
        let lat = array[index].fields.geo[0];
        let lng = array[index].fields.geo[1];
        let cycleAvailability = array[index].fields.nbvelosdispo;
        let parkcapacity = array[index].fields.nbplacesdispo;
        let temperature = Math.round(responseW.main.temp)
        let station = {id, name, lat, lng, bikeCapacity : cycleAvailability, parkCapacity : parkcapacity,temperature:temperature};
        stations.push(station);
    }
};

var Lyon = (response,responseW) => {
    response = JSON.parse(response);
    responseW = JSON.parse(responseW);
    let array = response.features;
    for (let index = 0; index < array.length; index++) {
        let id = response.name;
        let name = array[index].properties.name;
        let lat = Number(array[index].properties.lat);
        let lng = Number(array[index].properties.lng);
        let cycleAvailability = array[index].properties.available_bike_stands;
        let parkcapacity = array[index].properties.available_bikes;
        let temperature = Math.round(responseW.main.temp)
        let station = {id, name, lat, lng, bikeCapacity : cycleAvailability, parkCapacity : parkcapacity,temperature:temperature};
        stations.push(station);
    }
};

var StEtienne = (response,responseW) => {
    response = JSON.parse(response);
    responseW = JSON.parse(responseW);
    let array = response.data.stations;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].station_id;
        let name = array[index].name;
        let lat = array[index].lat;
        let lng = array[index].lon;
        let cycleAvailability = Math.trunc(array[index].capacity/3);
        let parkcapacity = Math.trunc(array[index].capacity/3*2); 
        let temperature = Math.round(responseW.main.temp)
        let station = {id, name, lat, lng, bikeCapacity : cycleAvailability, parkCapacity : parkcapacity,temperature:temperature};
        stations.push(station);
    }
};



var callUrl = async (url) => {
    xhr.open('GET', url, false);
    xhr.send(null);
    var response = xhr.responseText;
    return await response;
};


var getData = async () => {
    for (let index = 0; index < urls.length; index++) {
        const response = await callUrl(urls[index].url)
        const responseW = await callUrl(urlsWeather[index].url)
        console.log(index, urls[index].name)
        switch (urls[index].name) {
            case "StEtienne":
                StEtienne(response,responseW);
                break;
            case "Lyon":
                Lyon(response,responseW);
                break;
            case "Paris":
                Paris(response,responseW);
                break;
            case "Lille":
                Lille(response,responseW);
                break;
        }
    }
   return stations
};





async function main(){
    stations = []
    const stat = await getData()
    console.log("nombre de stations :",stat.length)
    const myjson = {
        "@context": {
        "@vocab" : "http://www.owl-ontologies.com/unnamed.owl/",
        "id" : "id",
        "name": "name",
        "bikeCapacity": "bikeCapacity",
        "parkCapacity": "parkCapacity",
        "lat":"lat",
        "lng":"lng",
        "temperature":"temperature"
        },
        "@graph": stat
    }
    
    const ntrip = await jsonld.toRDF(myjson, {format: 'application/n-quads'});
    fs.writeFileSync('./bikes.nt',ntrip)
    const resDelete = await axios({
        method: "POST",
        url: "http://localhost:3030/bikes/",
        headers : {
            'Content-type': 'application/sparql-update'
        },
        data: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        clear default`
    })

    const resUpdate = await axios({
        method: "POST",
        url: "http://localhost:3030/bikes",
        data: ntrip,
        headers: {
            'Content-Type': 'application/n-triples'
        }
    })
    return {"john":"doe"}
}
main()
  res.status(200).json({"over":"data"})
}



