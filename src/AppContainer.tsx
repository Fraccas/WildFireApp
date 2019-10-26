import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';

import AllFires  from './screens/AllFires';
import SingleFire  from './screens/SingleFire';
import AddFire from './screens/AddFire';
import MapFireView from './screens/MapFireView';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Settings from './screens/Settings';



const AuthStack = createStackNavigator({
    // screens
    Login
}, {
    // generic styling
    initialRouteName: 'Login',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#ffbf00'
        },
        headerTintColor: '#36454f',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
});

const AppStack = createStackNavigator({
    // screens
    AllFires,
    SingleFire,
    MapFireView,
    AddFire,
    Settings
}, {
    // generic styling
    initialRouteName: 'AllFires',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#ffbf00'
        },
        headerTintColor: '#36454f',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
});

const FiresTab = createBottomTabNavigator(
    {
        Fires: AppStack,
        AddFire: createStackNavigator(
            {
                AddFire
            }, 
            {
                defaultNavigationOptions: {
                    headerStyle: {
                        backgroundColor: '#ffbf00'
                    },
                    headerTintColor: '#36454f',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }
            }
        ),
        Settings: createStackNavigator(
            {
                Settings
            }, 
            {
                defaultNavigationOptions: {
                    headerStyle: {
                        backgroundColor: '#ffbf00'
                    },
                    headerTintColor: '#36454f',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }
            }
        ),
    },
    {
        initialRouteName: 'Fires',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor}) => {
                let { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Fires') {
                    iconName = 'fire';
                } else if (routeName === 'AddFire') {
                    iconName = 'edit';
                } else if (routeName == 'Settings') {
                    iconName = 'cog';
                }

                return (
                    <Icon 
                        type='font-awesome' 
                        color={`${tintColor}`}
                        name={`${iconName}`}
                        size={25} 
                    />
                );
            }
        }),
        tabBarOptions: {
            activeBackgroundColor: '#ffbf00',
            inactiveBackgroundColor: '#ffbf00',
            activeTintColor: 'white',
            inactiveTintColor: '#36454f'
        }
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        App: FiresTab,
        Auth: AuthStack,
        AuthLoading
    }, 
    {
        initialRouteName: 'AuthLoading'
    }
));