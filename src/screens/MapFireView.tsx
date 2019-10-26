import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';

import ApiFirePreviewCard from '../components/ApiFirePreviewCard';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';


// external libs
import { getDistance } from 'geolib';
const parseString = require('react-native-xml2js').parseString;

interface apiFire {
  id: string,
  title: string,
  published: string,
  link: string,
  lat: number,
  lon: number,
  distanceFromUser: number,
  description: string,
  coordinate : {
    latitude: number,
    longitude: number
  }
}

interface IHomeProps extends NavigationStackScreenProps { }
interface IHomeState {
  apiFires: {
    id: string,
    title: string,
    published: string,
    link: string,
    lat: number,
    lon: number,
    distanceFromUser: number,
    description: string,
    coordinate : {
      latitude: number,
      longitude: number
    }
  }[],
  region: {
      latitude: number,
      longitude: number,
      latitudeDelta: number,
      longitudeDelta: number
  }
}

let myLat: number;
let myLon: number;

export default class MapFireView extends React.Component<IHomeProps, IHomeState> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: "Map View"
  };

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      apiFires: [],
      region: {latitude: 0, longitude: 0, latitudeDelta: 1, longitudeDelta: 1}
    }
  }

  componentDidMount() {
    // set current gps coords from phone on load
    navigator.geolocation.getCurrentPosition(this.getPosition);

    this._getApiFires();
  }

  // sets gps coords
  getPosition = (position: any) => {
    myLat = position.coords.latitude;
    myLon = position.coords.longitude;
    this.setState({region: {latitude: myLat, longitude: myLon, latitudeDelta: 1, longitudeDelta: 1}});
  }

  async _getApiFires() {
    try {
      fetch('https://inciweb.nwcg.gov/feeds/rss/incidents/') // get xml from api
        .then(response => response.text())
        .then((responseText) => {
          let apifires:any;
          parseString(responseText, function (err: any, result: any) {
            if (result) {
              let jsonFire: any = JSON.stringify(result); // convert xml to json text
              jsonFire = JSON.parse(jsonFire); // convert json text to json obj
              if (jsonFire)
                apifires = jsonFire['rss']['channel'][0]['item']; // array of all fires
            }
          });

          //set lat/long object properties and get distance from user
          if (apifires.length > 0) {
            apifires.forEach(function (fire: any) {
              let lat = Number(fire['geo:lat']); 
              let lon = Number(fire['geo:long']);
              fire.lat = lat;
              fire.lon = lon;

              fire.id = 'map-fire-'+fire.title[0];
              fire.title = fire.title[0];
              fire.description = fire.description[0];
              fire.link = fire.link[0];
              fire.coordinate = {latitude: fire.lat, longitude: fire.lon};

              const dist = getDistance(
                { latitude: lat, longitude: lon },
                { latitude: myLat, longitude: myLon }
              );

              // // save dist in miles
              fire.distanceFromUser = Math.round((dist*0.000621) * 100) / 100;
            });
          }    

          apifires.sort((a:apiFire, b:apiFire) => (a.distanceFromUser > b.distanceFromUser) ? 1 : -1);

          this.setState({ apiFires: apifires });
        })
        .catch((err) => {
          console.log('Error fetching the feed: ', err)
        })
    } catch (e) {
      throw e;
    }
  }

  renderApiFires() {
    return this.state.apiFires.map((apifire, index) => {
      apifire.id = 'api-fire' + index;
      return <ApiFirePreviewCard key={apifire.id} apifire={apifire} />
    });
  }

  // Map View Functions
  getInitialState() {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  onRegionChange(region: any) {
    this.setState({ region });
  }

  render() {
    if (this.state.apiFires.length > 0) {
      return (
        <MapView
            style={styles.map}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            >
            {this.state.apiFires.map(fire => (
                <Marker
                  key={fire.id}
                  coordinate={fire.coordinate}
                  title={fire.title}
                  description={fire.description}
                />
            ))}
            </MapView>
      );
    } else {
      return (<Text style={styles.text}>Loading fire data...</Text>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 25,
    margin: 5,
    fontFamily: 'Cochin'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
