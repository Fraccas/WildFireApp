import * as React from 'react';
import { StyleSheet, View, Alert, Picker, ScrollView, AsyncStorage } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { Input, Button, Text } from 'react-native-elements';
import { ClearUser, GetUser, SetEmail, GetEmail, GetPhone } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    refresh: boolean,
    email: string,
    newEmail: string,
    phone: string,
    newPhone: string
}

let emailHolder, phoneHolder;
export default class Settings extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Settings"
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            refresh: false,
            email: 'NA',
            newEmail: 'NA',
            phone: 'NA', 
            newPhone: 'NA'
        };

        this.getUserData();
    }

    getUserData = async () => {
        let user = await GetUser();
        let email = await GetEmail();
        let phone = await GetPhone();
        this.setState({email});
        this.setState({phone});
        emailHolder = email;
        phoneHolder = phone;
    }

    handleSubmit = () => {
        
    }

    logout = () => {
        ClearUser();
        this.setState({refresh: true});
        this.props.navigation.navigate('Login');
    }


    render () {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Input
                        label="Email"
                        inputContainerStyle={{borderBottomWidth: 1}}
                        placeholder={this.state.email}
                        onChangeText={(text) => this.setState({newEmail: text})}
                    />        
                    <Input
                        label="Phone"
                        inputContainerStyle={{borderBottomWidth: 1}}
                        placeholder={this.state.phone}
                        onChangeText={(text) => this.setState({newPhone: text})}
                    />    
                </View>


                <Button
                    raised
                    title="Update Information"
                    containerStyle={{margin: 10}}
                    buttonStyle={styles.buttonStyle}
                    onPress={() => this.handleSubmit()}
                />
                <Button
                    raised
                    title="Logout"
                    containerStyle={{margin: 10}}
                    buttonStyle={styles.buttonStyle}
                    onPress={() => this.logout()}
                />
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