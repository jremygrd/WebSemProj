import React, { useEffect, useState,Component } from 'react';
import ReactMapGL, { Marker } from "react-map-gl";
import styles from "../../styles/Home.module.css";
var axios = require('axios');
var qs = require('querystring');
import Popup from './popup'

class Map extends Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 48.85,
      longitude: 2.35,
      zoom: 13,
    },
    stations:[]
  };

componentDidMount() {
    this.Refresh();
  }

Refresh = async() => {
    let stations = []
    try{
    console.log("refreshing")
    var q = `PREFIX stat: <http://www.owl-ontologies.com/unnamed.owl/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>  
    PREFIX spatialF: <http://jena.apache.org/function/spatial#>
    PREFIX wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX st: <http://semweb.mmlab.be/ns/stoptimes#>
    SELECT DISTINCT ?id ?name ?lat ?lng ?bikeCapacity ?parkCapacity ?temperature
    where{
        ?StationChoisie stat:id ?id .
        ?StationChoisie stat:temperature ?temperature . 
        ?StationChoisie stat:name ?name .
        ?StationChoisie stat:lat ?lat .
        ?StationChoisie stat:lng ?lng .
        ?StationChoisie stat:bikeCapacity ?bikeCapacity .
        ?StationChoisie stat:parkCapacity ?parkCapacity .
        FILTER(?lng<${this.state.viewport.longitude}+0.025) .
        FILTER(?lat<${this.state.viewport.latitude}+0.015) .
        FILTER(?lng>${this.state.viewport.longitude}-0.025) .
        FILTER(?lat>${this.state.viewport.latitude}-0.015) .
    } 
    limit 5`;
    axios({
      method: "POST",
      url: "http://localhost:3030/bikes/query",
      data: qs.stringify({ query: q }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }).then((response) => {
      const bindings = response.data.results.bindings;
      bindings.forEach((bind) => {
        let station = {
          id: bind.id.value,
          name: bind.name.value,
          lat: bind.lat.value.slice(0,10),
          lng: bind.lng.value.slice(0,10),
          bikeCapacity: bind.bikeCapacity.value,
          parkCapacity: bind.parkCapacity.value,
        };
        stations.push(station);
      });
      this.setState({stations:stations})
      console.log(this.state.stations)
    });
    }finally{
        
    }
  }


  render() {
    return (
      <>
        <div className={styles.splitLeft}>
          <div className={styles.centered}>
            <h2>Jane Flex</h2>
            <p onClick={this.Refresh} className = {styles.button}>Click here to look around here</p>
          </div>
        </div>

        <div className={styles.splitRight}>
          <div className={styles.centered}>
            <div>
              <ReactMapGL
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxApiAccessToken="pk.eyJ1IjoiYmlsaWJvcGV1ciIsImEiOiJja21lc2gzcmExcnIyMm9xbGlpeXAzM2d6In0.0YYuHNBRMRkKisT1YMkujA"
                onViewportChange={(viewport) => {this.setState({ viewport:viewport })}}
                {...this.state.viewport}
              >
               {
                  this.state.stations.map((station)=>
                      (
                    <Marker
                        id={station.name}
                        latitude={parseFloat(station.lat)<20 ?parseFloat(station.lat)*10:parseFloat(station.lat)}
                        longitude={parseFloat(station.lng)}
                        
                        >
                  <Popup>{station}</Popup>
                    
                </Marker>
                  ))
              }

              </ReactMapGL>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Map;
