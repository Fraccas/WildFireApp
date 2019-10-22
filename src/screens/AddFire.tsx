import * as React from 'react';
import { StyleSheet, View, Alert, Picker, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { Input, Button, Text } from 'react-native-elements';
import { getUser, json } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    lat: number,
    lon: number,
    userid: number,
    threat: number,
    photo: string,
    _created: number,
    threatList: string[],
    selectedThreat: string
}

export default class AddFire extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Report Fire"
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            lat: 0,
            lon: 0,
            userid: 0,
            threat: 0,
            photo: 'NA',
            _created: Date.now(),
            threatList: ['Low', 'Moderate', 'High', 'Severe'],
            selectedThreat: 'Low'
        };
    }

    private saving: boolean = false;


    async handleSubmit() {
        if (this.saving) return; // already clicked, don't rerun logic

        if (!this.state.threat) {
            Alert.alert("Please fill out all inputs!");
            return;
        }

        // get gps location

        let { userid } = await getUser();
        let newFire = {
            lat: 0,
            lon: 0,
            userid: userid,
            threat: this.state.threat,
            photo: this.state.photo,
            _created: Date.now()
        }

        try {
            this.saving = true;

            let result = await json(`https://afternoon-basin-48933.herokuapp.com/api/fires/post`, 'POST', newFire);
            
            if (result) {
                // wipe state
                this.setState({
                    lat: 0,
                    lon: 0,
                    userid: 0,
                    threat: 0,
                    photo: 'NA',
                    _created: Date.now()
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
          backgroundColor: '#AE3CD7',
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