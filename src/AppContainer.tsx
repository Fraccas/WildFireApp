import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';

import Fires  from './screens/AllFires';
import AddFire from './screens/AddFire';

import AuthLoading from './screens/AuthLoading';
import Login from './screens/Login';
import Logout from './screens/Login';



const AuthStack = createStackNavigator({
    // screens
    Login
});

const AppStack = createStackNavigator({
    // screens
    Fires,
    AddFire,
    Logout
}, {
    // generic styling
    initialRouteName: 'Fires',
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
        )
    },
    {
        initialRouteName: 'Fires',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor}) => {
                let { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Fires') {
                    iconName = 'rss';
                } else if (routeName === 'AddFire') {
                    iconName = 'edit';
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