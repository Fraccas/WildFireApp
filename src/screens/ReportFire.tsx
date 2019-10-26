import * as React from 'react';
import { StyleSheet, View, Alert, Picker, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { Input, Button, Text } from 'react-native-elements';
import { GetUser, json } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    lat: number,
    lon: number,
    userid: number,
    photo: string,
    threatList: string[],
    selectedThreat: string
}

export default class ReportFire extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Report Fire"
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            lat: 0,
            lon: 0,
            userid: 0,
            photo: 'NA',
            threatList: ['Low', 'Moderate', 'High', 'Severe'],
            selectedThreat: 'Low'
        };

        // get gps location on load
        navigator.geolocation.getCurrentPosition(this.getPosition);
    }

    private saving: boolean = false;

    getPosition = (position: any) => {
        this.setState({lat : position.coords.latitude});
        this.setState({lon : position.coords.longitude});
    }


    async handleSubmit() {
        if (this.saving) return; // already clicked, don't rerun logic

        if (!this.state.selectedThreat) {
            Alert.alert("Please fill out all inputs!");
            return;
        }

        let { userid } = await GetUser();
        let newFire = {
            lat: this.state.lat,
            lon: this.state.lon,
            userid: userid,
            threat: this.state.selectedThreat,
            photo: this.state.photo
        }

        try {
            this.saving = true;

            let result = await json(`https://report-wildfire-app.herokuapp.com/api/fires/new`, 'POST', newFire);
            
            if (result) {
                // wipe state
                this.setState({
                    lat: 0,
                    lon: 0,
                    userid: 0,
                    selectedThreat: 'Low',
                    photo: 'NA'
                });
                this.props.navigation.navigate('AllFires');
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error adding new fire!');
        } finally {
            this.saving = false;
        }
    }

    render () {
        return (
            <ScrollView>
            <View style={styles.container}>
                <Text style={styles.customLabel}>Please select the threat level and we'll do the rest.</Text>
                <View style={styles.pickerContainer}>                   
                    <Picker
                        style={{height: 200, width: 200}}
                        selectedValue={this.state.selectedThreat}
                        onValueChange={(itemValue) => this.setState({selectedThreat: itemValue})}
                    >
                        {this.state.threatList.map(t=> (
                            <Picker.Item key={t} label={`${t}`} value={t}/>
                        ))}
                    </Picker>                 
                </View>


                <Button
                    raised
                    title="Submit"
                    containerStyle={{margin: 10}}
                    buttonStyle={styles.buttonStyle}
                    onPress={() => this.handleSubmit()}
                />
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'solid',
        margin: 15,
        padding: 10
      },
      pickerContainer: {
        flex: 1
      },
      text: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 25,
        margin: 5,
        fontFamily: 'Cochin'
      },
      buttonStyle: {
          backgroundColor: '#36454f',
          borderWidth: 2,
          borderColor: '#43005B',
          width: '100%'
      },
      customLabel: {
          fontWeight: 'bold',
          fontSize: 24,
          color: '#86939e'
      }
});