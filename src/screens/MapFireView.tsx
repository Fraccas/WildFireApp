import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';
import { getLocationText } from '../utils/map';
import { json } from '../utils/api';

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
  descriptionText: string,
  coordinate: {
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
    descriptionText: string,
    coordinate: {
      latitude: number,
      longitude: number
    },
    location: string
  }[],
  region: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
  },
  userFires: {
    id: number,
    lat: number,
    lon: number,
    userid: string,
    threat: string,
    photo: string,
    _created: Date,
    distanceFromUser: number,
    description: string,
    descriptionText: string,
    coordinate: {
      latitude: number,
      longitude: number
    },
    location: string
  }[]
}

let myLat: number;
let myLon: number;

export default class MapFireView extends React.Component<IHomeProps, IHomeState> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: "Fires in the US"
  };

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      apiFires: [],
      region: { latitude: 0, longitude: 0, latitudeDelta: 10, longitudeDelta: 10 },
      userFires: []
    }
  }

  componentDidMount() {
    // set current gps coords from phone on load
    navigator.geolocation.getCurrentPosition(this.getPosition);

    this._getApiFires();
    this._getUserFires();
  }

  // sets gps coords
  getPosition = (position: any) => {
    myLat = position.coords.latitude;
    myLon = position.coords.longitude;

    // set mapview region
    let region = { latitude: myLat, longitude: myLon, latitudeDelta: 10, longitudeDelta: 10 };
    this.setState({ region });
  }

  async _getUserFires() {
    try {
      let fires = await json('https://report-wildfire-app.herokuapp.com/api/fires');

      fires.forEach(async function (fire: any) {
        const dist = getDistance(
          { latitude: fire.lat, longitude: fire.lon },
          { latitude: myLat, longitude: myLon }
        );
        // save dist in miles
        fire.distanceFromUser = Math.round((dist * 0.000621) * 100) / 100;
        
        fire.descriptionText = "This is an unconfirmed fire submitted by a user. The user marked this fire as: (" + fire.threat + " Threat). User Description: " + fire.description;
        let shortText= "This fire has not been confirmed. Read more...";

        fire.description = shortText;

        fire.coordinate = {latitude: fire.lat, longitude: fire.lon}
        let locText: string = await getLocationText(fire.lat, fire.lon) as string;
              fire.location = locText;
      });

      this.setState({ userFires: fires });

    } catch (e) {
      console.log(e);
    }
  }

  async _getApiFires() {
    try {
      fetch('https://inciweb.nwcg.gov/feeds/rss/incidents/') // get xml from api
        .then(response => response.text())
        .then((responseText) => {
          let apifires: any;
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
            apifires.forEach(async function (fire: any) {

              let lat = Number(fire['geo:lat']);
              let lon = Number(fire['geo:long']);
              fire.lat = lat;
              fire.lon = lon;

              fire.id = 'map-fire-' + fire.title[0];
              fire.title = fire.title[0];

              fire.link = fire.link[0];
              fire.coordinate = { latitude: fire.lat, longitude: fire.lon };

              const dist = getDistance(
                { latitude: lat, longitude: lon },
                { latitude: myLat, longitude: myLon }
              );

              // // save dist in miles
              fire.distanceFromUser = Math.round((dist * 0.000621) * 100) / 100;

              let locText: string = await getLocationText(lat, lon) as string;
              fire.location = locText;

              // admins don't always add descriptions
              if (fire.description === undefined) {
                fire.descriptionText = 'No description provided...';
              } else
                fire.descriptionText = fire.description[0];
            });
          }

          apifires.sort((a: apiFire, b: apiFire) => (a.distanceFromUser > b.distanceFromUser) ? 1 : -1);

          this.setState({ apiFires: apifires });
        })
        .catch((err) => {
          console.log('Error fetching the feed: ', err)
        })
    } catch (e) {
      throw e;
    }
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
    //this.setState({ region });
  }

  render() {
    if (this.state.apiFires.length > 0) {
      return (
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          <Button
            buttonStyle={{ backgroundColor: '#36454f', width: '100%', borderRadius: 1, marginLeft: 0, marginRight: 0, marginBottom: 3, marginTop: 0 }}
            title={'  View Fires(' + this.state.apiFires.length + ') in List Mode'}
            onPress={() => this.props.navigation.navigate('AllFires')}
          />
          {this.state.apiFires.map(fire => (
            <Marker
              key={fire.id}
              image={require('../../assets/flame.png')}
              coordinate={fire.coordinate}
              title={fire.title}
              pinColor={'#ffbf00'}
              description={fire.descriptionText}
              onCalloutPress={() => this.props.navigation.navigate('SingleFire', {
                apiFire: fire, location: fire.location,
              })}
            />
          ))}
          {this.state.userFires.map(fire => (
              <Marker
                key={fire.id}
                image={require('../../assets/warning.png')}
                coordinate={fire.coordinate}
                title={"User Submitted Fire"}
                pinColor={'#ffbf00'}
                description={fire.description}
                onCalloutPress={() => this.props.navigation.navigate('SingleFire', {
                  apiFire: fire, location: fire.location,
                })}
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
  text: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 25,
    margin: 5,
    fontFamily: 'Cochin',
    alignContent: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
