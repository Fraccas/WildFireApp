import * as React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { json, SetAccessToken, getUser } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    email: string,
    password: string
}

export default class Login extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Login"
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    async componentDidMount() {
        let user = await getUser();
        if (user && user.role) {
            this.props.navigation.navigate('AllBlogs');
        }
    }

    async handleLogin () {
        try {
            let result = await json('https://afternoon-basin-48933.herokuapp.com/auth/login', 'POST', {
                email: this.state.email,
                password: this.state.password
            });

            if (result) {
                await SetAccessToken(result.token, {userid: result.userid, role: result.role});
                let user = await getUser();
                if (user && user.role) {
                    this.props.navigation.navigate('AllBlogs');
                } else {
                    Alert.alert('Invalid login information!');
                }
            } else {
                Alert.alert('Invalid login information!');
            }
        } catch(e) {
            console.log(e);
            Alert.alert("Problem logging in? Contact your admin!");
        }
    }

    async handleRegister () {
        try {
            let result = await json('https://afternoon-basin-48933.herokuapp.com/auth/register', 'POST', {
                name: this.state.email,
                email: this.state.email,
                password: this.state.password
            });

            if (result) {
                await SetAccessToken(result.token, {userid: result.userid, role: result.role});
                let user = await getUser();
                if (user && user.role) {
                    this.props.navigation.navigate('AllBlogs');
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Input 
                        textContentType="emailAddress"
                        containerStyle={{marginVertical: 15}}
                        leftIcon={{type: 'font-awesome', name: 'envelope'}}
                        placeholder=" Email..."
                        value={this.state.email}
                        onChangeText={(text) => this.setState({email: text})}
                    />
                    <Input 
                        containerStyle={{marginVertical: 15}}
                        secureTextEntry={true}
                        textContentType="password"
                        leftIcon={{type: 'font-awesome', name: 'key'}}
                        placeholder=" Password..."
                        value={this.state.password}
                        onChangeText={(text) => this.setState({password: text})}
                    />
                </View>
                <View style={{flex:1}}>
                    <Button 
                        raised
                        title="Login"
                        containerStyle={{margin: 10}}
                        buttonStyle={{backgroundColor: '#AE3CD7'}}
                        onPress={() => this.handleLogin()}
                    />
                    <Button 
                        raised
                        title="Register"
                        containerStyle={{margin: 10}}
                        buttonStyle={{backgroundColor: '#AE3CD7'}}
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