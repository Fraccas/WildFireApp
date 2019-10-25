import * as React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';
import { json } from '../utils/api';
import FirePreviewCard from '../components/FirePreviewCard';
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
  distanceFromUser: number
}[]
interface IHomeProps extends NavigationStackScreenProps { }
interface IHomeState {
  fires: {
    id: number,
    lat: number,
    lon: number,
    userid: string,
    threat: string,
    photo: string,
    _created: Date,
    distanceFromUser: number
  }[],
  users: Array<string>,
  apiFires: {
    id: string,
    title: string,
    published: string,
    link: string,
    lat: number,
    lon: number,
    distanceFromUser: number
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
      fires: [],
      users: [],
      apiFires: []
    }
  }

  componentDidMount() {
    // set current gps coords from phone on load
    navigator.geolocation.getCurrentPosition(this.getPosition);

    //this._getFires(); 
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
            });
          }    
          this.setState({ apiFires: apifires });
        })
        .catch((err) => {
          console.log('Error fetching the feed: ', err)
        })
    } catch (e) {
      throw e;
    }
  }

  // async _getFires() {
  //   try {
  //     let fires = await json('https://report-wildfire-app.herokuapp.com/api/fires'); 

  //     fires.forEach(async function (fire: any) {     
  //         const dist = getDistance(
  //           { latitude: fire.lat, longitude: fire.lon },
  //           { latitude: myLat, longitude: myLon }
  //         );
  //         // save dist in miles
  //         fire.distanceFromUser = Math.round((dist*0.000621) * 100) / 100;
  //     });

  //     this.setState({fires})

  //     // set author names from db
  //     this._setUsers();

  //   } catch (e) {
  //     console.log(e);
  //     Alert.alert("Error on front end api request!");
  //   }
  // }

  //   async _setUsers() { 
  //     try {
  //       let users: Array<string> = [];
  //       for (let fire of this.state.fires) {
  //         let u = await json('https://report-wildfire-app.herokuapp.com/api/users/' + fire.userid); 
  //         users.push(u[0]['name']);
  //       }
  //       this.setState({users});
  //   } catch (e) {
  //     console.log(e); 
  //   }
  // }

  // renderFires() {
  //   return this.state.fires.map((fire, index) => { 
  //     if (this.state.users[index]) {
  //       return <FirePreviewCard key={fire.id} fire={fire} authorname={this.state.users[index]} />
  //     }
  //   });
  // }

  renderApiFires() {
    return this.state.apiFires.map((apifire, index) => {
      apifire.id = 'api-fire' + index;
      return <ApiFirePreviewCard key={apifire.id} apifire={apifire} />
    });
  }

  render() {
    // if (this.state.fires) {
    //   return (
    //     <View style={styles.container}>
    //       <NavigationEvents onDidFocus={() => this._getFires()} />
    //       <Text style={styles.text}>{this.state.fires.length} Fires Near You</Text>
    //         <ScrollView style={{width: '90%'}}>
    //           {this.renderFires()}
    //         </ScrollView>

    //     </View>
    //   );
    // } else {
    //   return (<Text style={styles.text}>Loading fire data...</Text>);
    // }

    if (this.state.apiFires.length > 0) {
      return (
        <View style={styles.container}>
          { <NavigationEvents onDidFocus={() => this._getApiFires()} /> } 
          <Text style={styles.text}>{this.state.apiFires.length} Fires Found</Text>
          <ScrollView style={{ width: '90%' }}>
            {this.renderApiFires()}
          </ScrollView>

        </View>
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
  }
});
