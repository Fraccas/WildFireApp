import * as React from 'react';
import { StyleSheet, View, Alert, AsyncStorage } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { json, SetAccessToken, GetUser, SetEmail, SetPhone } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    username: string,
    phone: string,
    email: string,
    password: string
}

export default class Register extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "New Account"
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            username: '',
            phone: '',
            email: '',
            password: ''
        };
    }

    async componentDidMount() {
        let user = await GetUser();
        if (user && user.role) {
            this.props.navigation.navigate('AllFires');
        }
    }

    // async handleRegister () {
    //     try {
    //         let result = await json('https://report-wildfire-app.herokuapp.com/auth/register', 'POST', {
    //             name: this.state.username,
    //             phone: this.state.phone,
    //             email: this.state.email,
    //             password: this.state.password
    //         });

    //         if (result) {
    //             await SetAccessToken(result.token, {userid: result.userid, name: result.name, role: result.role, phone: result.phone});
    //             let user = await GetUser();
    //             if (user && user.role) {
    //                 SetEmail(this.state.email);
    //                 this.props.navigation.navigate('AllFires');
    //             } else {
    //                 Alert.alert('Invalid login information!');
    //             }
    //         } else {
    //             Alert.alert('Invalid login information!');
    //         }
    //     } catch(e) {
    //         console.log(e);
    //         Alert.alert("Problem logging in? Contact your admin!");
    //     }
    // }

    async handleRegister () {
        try {
            let result = await json('https://report-wildfire-app.herokuapp.com/auth/register', 'POST', {
                name: this.state.email,
                email: this.state.email,
                phone: this.state.phone,
                password: this.state.password
            });

            if (result) {
                await SetAccessToken(result.token, {userid: result.userid, name: result.name, role: result.role, phone: result.phone});
                let user = await GetUser();
                if (user && user.role) {
                    SetEmail(this.state.email); // set user data locally
                    SetPhone(this.state.phone);
                    this.props.navigation.navigate('AllFires');
                } else {
                    Alert.alert('Invalid user information!'); 
                }
            } else {
                Alert.alert('Invalid user information!');
            }
        } catch(e) {
            console.log(e);
            Alert.alert("Problem registering? Contact your admin!");
        }
    }

    sendRegister() {
        this.props.navigation.navigate('Register');
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Input 
                        containerStyle={{marginVertical: 15}}
                        placeholder=" username..."
                        value={this.state.username}
                        onChangeText={(text) => this.setState({username: text})}
                    />
                    <Input 
                        textContentType="emailAddress"
                        containerStyle={{marginVertical: 15}}
                        placeholder=" Email..."
                        value={this.state.email}
                        onChangeText={(text) => this.setState({email: text})}
                    />
                    <Input 
                        containerStyle={{marginVertical: 15}}
                        placeholder=" Phone..."
                        value={this.state.phone}
                        onChangeText={(text) => this.setState({phone: text})}
                    />
                    <Input 
                        containerStyle={{marginVertical: 15}}
                        secureTextEntry={true}
                        textContentType="password"
                        placeholder=" Password..."
                        value={this.state.password}
                        onChangeText={(text) => this.setState({password: text})}
                    />
                </View>
                <View style={{flex:1}}>
                    <Button 
                        raised
                        title="Create Account"
                        containerStyle={{margin: 10}}
                        buttonStyle={{backgroundColor: '#36454f'}}
                        onPress={() => this.handleRegister()}
                    />
                </View>
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
    }
  });