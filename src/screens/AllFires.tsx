import * as React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';
import { json } from '../utils/api';
import FirePreviewCard from '../components/FirePreviewCard';

interface IHomeProps extends NavigationStackScreenProps { }
interface IHomeState {
  fires: {
    id: number,
    lat: number,
    lon: number,
    userid: string,
    threat: string,
    photo: string,
    _created: Date
  }[],
  users: Array<string>;
}

export default class AllFires extends React.Component<IHomeProps, IHomeState> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: "Fires"
  };

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      fires: [],
      users: []
    }
    this._getFires();
  }

  

  async _getFires() {
    try {
      let fires = await json('https://report-wildfire-app.herokuapp.com/api/fires'); 
      this.setState({fires})

      // set author names from db
      this._setUsers();

    } catch (e) {
      console.log(e);
      Alert.alert("Error on front end api request!");
    }
  }

    async _setUsers() {
      try {
        let users: Array<string> = [];
        for (let fire of this.state.fires) {
          let u = await json('https://report-wildfire-app.herokuapp.com/api/users/' + fire.userid); 
          users.push(u[0]['name']);
        }
        this.setState({users});
    } catch (e) {
      console.log(e); 
    }
  }

  renderFires() {
    let count = 0;
    return this.state.fires.map((fire, index) => { 
      if (this.state.users[index]) {
        return <FirePreviewCard key={fire.id} fire={fire} authorname={this.state.users[index]} />
      }
    });
  }

  render () { 
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this._getFires()} />
        <Text style={styles.text}>Current Fires</Text>
          <ScrollView style={{width: '90%'}}>
            {this.renderFires()}
          </ScrollView>
        
      </View>
    );
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
