import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';
import ApiFirePreviewCard from '../components/ApiFirePreviewCard';


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
  descriptionText: string
}[]
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
    descriptionText: string
  }[]
}

let myLat: number;
let myLon: number;

export default class AllFires extends React.Component<IHomeProps, IHomeState> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: "Fires"
  };

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      apiFires: []
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
              fire.link = fire.link[0];
              let lat = Number(fire['geo:lat']); 
              let lon = Number(fire['geo:long']);
              fire.lat = lat;
              fire.lon = lon;

              const dist = getDistance(
                { latitude: lat, longitude: lon },
                { latitude: myLat, longitude: myLon }
              );

              // // save dist in miles
              fire.distanceFromUser = Math.round((dist*0.000621) * 100) / 100;

              // admins don't always add descriptions
              if (fire.description === undefined) {              
                fire.descriptionText = 'No description provided...';
              } else 
                fire.descriptionText = fire.description[0];
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

  render() {
    if (this.state.apiFires.length > 0) {
      return (
        <>
        <View style={{width:'100%'}}>
          <Button
              icon={<Icon name='map' color='#ffffff' />}
              buttonStyle={{ backgroundColor: '#36454f', alignSelf: 'stretch', width: '100%', borderRadius: 1, marginLeft: 0, marginRight: 0, marginBottom: 3, marginTop: 0 }}
              title='  View Fires on Map'
              onPress={() => this.props.navigation.navigate('MapFireView')}
          />
        </View>
        <View style={styles.container}>
          
          { <NavigationEvents onDidFocus={() => this._getApiFires()} /> } 
          <Text style={styles.text}>{this.state.apiFires.length} Fires Found</Text>
          <ScrollView style={{ width: '95%' }}>
            {this.renderApiFires()}
          </ScrollView>

        </View>
        </>
      );
    } else {
      return (<Text style={styles.loading}>Loading fire data...</Text>);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
  loading: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 25,
    margin: 5,
    fontFamily: 'Cochin',
    alignContent: 'center'
  }
});
