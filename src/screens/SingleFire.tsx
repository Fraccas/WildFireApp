import * as React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Linking } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { NavigationScreenOptions, NavigationParams } from 'react-navigation';

interface Props extends NavigationParams {}
interface State {
    apiFire: {
        id: string,
        title: string,
        published: string,
        link: string,
        lat: number,
        lon: number,
        distanceFromUser: number,
        description: string
    },
    location: string
}

export default class SingleFire extends React.Component<Props, State> {

    static navigationOptions: NavigationScreenOptions = {
        headerTitle: 'Fire Data'
    };

    constructor(props: Props) {
      super(props);
      this.state = {
        apiFire: {id: '', title: '', published: '', link: '', lat: 0, lon: 0, distanceFromUser: 0, description: ''},
        location: ''
      };
    }

    async componentDidMount() {
      try {
        const fire = this.props.navigation.getParam('apiFire', 'NO-FIRE');
        this.setState({apiFire: fire});
        const location = this.props.navigation.getParam('location', 'NO-LOCATION');
        this.setState({location});
      } catch (e) {
        console.log(e);
        Alert.alert("Error on grabbing fire parm!");
      }
    }

    render() {
      const {title, published, link, distanceFromUser, description } = this.state.apiFire;
      return (
        
          <View style={styles.container}>
            <Text style={styles.titleStyle}>{title}</Text>
            <Text style={styles.tagStyle}>{this.state.location}</Text>
            <ScrollView>
            <View style={styles.container}>
            <Text style={styles.altText}>{distanceFromUser} MILES FROM YOUR LOCATION</Text>
                <Text style={styles.bodyTextStyle}>{description}</Text>
                <Text style={styles.altText}>Fire Published: {published}</Text>               

                <Button 
                    buttonStyle={{ backgroundColor: '#36454f', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5 }}
                    title="View More" 
                    onPress={ ()=>{ Linking.openURL(link)}} 
                />
            </View>
            </ScrollView>
          </View>

      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    textAlign: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid'
  },
  titleStyle: {
    marginTop: 5,
    textAlign: 'center',
    color: 'black',
    fontSize: 30
  },
  tagStyle: {
    margin: 15,
    textAlign: 'center', 
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    padding: 15,
    backgroundColor: '#36454f',
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid'
  },
  text: {
    fontSize: 15,
    color: 'black',
    backgroundColor: 'white',
    lineHeight: 55
  },
  bodyTextStyle: {
    color: '#000',
    fontSize: 17,
    lineHeight: 25
  },
  altText: {
    color: 'black',
      marginTop: 15,
      marginBottom: 15,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center'
  }
});
