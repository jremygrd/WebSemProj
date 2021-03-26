import React, { useEffect, useState,Component } from 'react';
import ReactMapGL, { Marker , GeolocateControl} from "react-map-gl";
import styles from "../../styles/Home.module.css";
import Emoji from "react-emoji-render"
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
      zoom: 9,
    },
    stations:[],
    userLocation:{}

  };


componentDidMount() {
    // this.setUserLocation();
    navigator.geolocation.getCurrentPosition(position=>this.setState({userLocation:{lat: position.coords.latitude, long:position.coords.longitude}}));
    this.Refresh();
  }

Refresh = async() => {
      console.log(this.state)
    let stations = []
    try{
    console.log("refreshing")
    var q = `PREFIX stat: <http://www.owl-ontologies.com/unnamed.owl/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>  

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
    limit 25`;
    axios({
      method: "POST",
      url: "http://localhost:3030/bikes/query",
      data: qs.stringify({ query: q }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }).then((response) => {console.log(response);
      const bindings = response.data.results.bindings;
      bindings.forEach((bind) => {
        let station = {
          id: bind.id.value,
          name: bind.name.value,
          lat: bind.lat.value.slice(0,10),
          lng: bind.lng.value.slice(0,10),
          bikeCapacity: bind.bikeCapacity.value,
          parkCapacity: bind.parkCapacity.value,
          temperature: bind.temperature.value,
          open: false,
        };
        stations.push(station);
      });
      this.setState({stations:stations})
      console.log(this.state.stations)
    });
    }finally{
        
    }
  }

  geolocateControlStyle= {
    right: 10,
    top: 10
  };


  render() {
    return (
      <>
        <div className={styles.splitLeft} style={{}}>
          <div prefix="foo: http://www.owl-ontologies.com/unnamed.owl/" vocab="http://www.owl-ontologies.com/unnamed.owl/" className={styles.scrollbar} style={{height: "90vh", overflow: "scroll", overflowX: "hidden"}} >{
              this.state.stations.map((station)=>
                          (
                            <div style = {{padding: "10px", backgroundColor: "white", margin: "10px", borderRadius: "10px", boxShadow:"0px 2px 20px 0 rgba(0,0,0,0.2)", cursor:"pointer"}} 
                            onClick={()=>{this.setState({viewport:{
                              width: "100vw",
                              height: "100vh",
                              latitude: parseFloat(station.lat)<20 ?parseFloat(station.lat)*10:parseFloat(station.lat),
                              longitude: parseFloat(station.lng),
                              zoom: 13,
                            }}); station.open = true;}} className = {styles.card}>
                              <h3 style = {{fontFamily: "sans-serif"}}>
                                <div style = {{display:"inline-flex"}}>
                                  <Emoji style={{marginRight:"10px"}} text = "	📍"/><div property = "foo:name">{station.name} </div>
                                </div>
                              </h3>
                              <h4 style = {{fontFamily: "sans-serif" }}>
                                <div style = {{display:"inline-flex"}}>
                                  <Emoji style={{marginRight:"10px"}} text = "🅿️"/><div property = "foo:parkCapacity">{station.parkCapacity}</div>
                                </div><br/><br/>
                                <div style = {{display:"inline-flex"}}>
                                  <Emoji style={{marginRight:"10px"}} text = "🚲"/><div property = "foo:bikeCapacity">{station.bikeCapacity}</div>
                                </div><br/><br/>
                                <div style = {{display:"inline-flex", marginBottom:"5px"}}>
                                  <Emoji style={{marginRight:"10px"}} text = "🌡️"/><div property = "foo:temperature">{station.temperature} °C </div>
                                </div>
                              </h4>
                              <div className={styles.invdiv} property="foo:lng">{station.lng} </div>
                              <div className={styles.invdiv} property="foo:lat">{station.lat} </div>
                        </div>
                      ))
                  }
          </div>
          <div className="div" style={{ height: "6vh"}}>
            <p onClick={this.Refresh} className = {styles.button} style = {{fontFamily: "sans-serif", margin:"10px", fontSize:"20px", textAlign:"center"}}>Click here to look around</p>
          </div>
        </div>

        <div>
          <div className={styles.centered}>
            <div>
              <ReactMapGL
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxApiAccessToken="pk.eyJ1IjoiYmlsaWJvcGV1ciIsImEiOiJja21lc2gzcmExcnIyMm9xbGlpeXAzM2d6In0.0YYuHNBRMRkKisT1YMkujA"
                onViewportChange={(viewport) => {this.setState({ viewport:viewport })}}
                {...this.state.viewport}
                >
                {/* <GeolocateControl
                  
                  positionOptions={{enableHighAccuracy: true}}
                  trackUserLocation={true}
                  auto
                /> */}
                    {/* {
                      this.state.userLocation.lat ?
                      <Marker
                            id={'userpos'}
                            latitude={this.state.userLocation.lat}
                            longitude={this.state.userLocation.long}                       
                            >
                       VOUS                      
                    </Marker>:null
                    } */}
                    
                  {
                      this.state.stations.map((station)=>
                          (
                        <Marker
                            id={station.name}
                            latitude={parseFloat(station.lat)<20 ?parseFloat(station.lat)*10:parseFloat(station.lat)}
                            longitude={parseFloat(station.lng)}                       
                            >
                        <Popup >
                          {station}
                        </Popup>                        
                    </Marker>
                      ))
                  }
              </ReactMapGL>
            </div>
          </div>
        </div>
        <div className={styles.splitRight}>
          <div style = {{display:"inline-flex"}}>
            <div className="div" style={{ height: "4vh", width: "8vw", margin:"1vw 1vh"}}>
                <p onClick={()=>{this.setState({viewport:{
                              width: "100vw",
                              height: "100vh",
                              latitude: 48.85,
                              longitude: 2.35,
                              zoom: 13,
                            }}); this.Refresh}} className = {styles.button} style = {{fontFamily: "sans-serif", textAlign:"center"}}>Paris</p>
              </div>
              <div className="div" style={{ height: "4vh", width: "8vw", margin:"1vw 1vh"}}>
                <p onClick={()=>{this.setState({viewport:{
                              width: "100vw",
                              height: "100vh",
                              latitude: 50.63,
                              longitude: 3.06,
                              zoom: 13,
                            }}); this.Refresh}} className = {styles.button} style = {{fontFamily: "sans-serif", textAlign:"center"}} className = {styles.button} style = {{fontFamily: "sans-serif", textAlign:"center"}}>Lille</p>
              </div>
            </div>
            <div style = {{display:"inline-flex"}}>
              <div className="div" style={{ height: "4vh", width: "8vw", margin:"1vw 1vh"}}>
                <p onClick={()=>{this.setState({viewport:{
                              width: "100vw",
                              height: "100vh",
                              latitude: 45.75,
                              longitude: 4.85,
                              zoom: 13,
                            }}); this.Refresh}} className = {styles.button} style = {{fontFamily: "sans-serif", textAlign:"center"}}>Lyon</p>
              </div>
              <div className="div" style={{height: "4vh", width: "8vw", margin:"1vw 1vh"}}>
                <p onClick={()=>{this.setState({viewport:{
                              width: "100vw",
                              height: "100vh",
                              latitude: 45.43,
                              longitude: 4.38,
                              zoom: 13,
                            }});
                            setTimeout(()=> {this.Refresh; }, 1000)
                            }} className = {styles.button} style = {{fontFamily: "sans-serif", textAlign:"center"}}>Saint-Etienne</p>
              </div>
            </div>
        </div>
      </>
    );
  }
}

export default Map;


function computeDistance(l1,l2) {
  console.log(l1,l2,"uigiug")
  var lat1 = parseFloat(l1.lat)
  var lat2 = parseFloat(l2.lat)
  if(parseFloat(l1.lat) < 20){
    l1.lat = l1.lat*10
  }
  if(parseFloat(l2.lat) < 20){
    l2.lat = l2.lat*10
  }
  lat1 = parseFloat(l1.lat)
  var lon1 = parseFloat(l1.lng)

  lat2 = parseFloat(l2.lat)
  var lon2 = parseFloat(l2.long)

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d.toFixed(2);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}