import * as React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';
import AllBlogs  from './screens/AllBlogs';
import SingleBlog from './screens/SingleBlog';
import Login from './screens/Login';
import AuthLoading from './screens/AuthLoading';
import AddBlog from './screens/AddBlog';

const AuthStack = createStackNavigator({
    // screens
    Login
});

const AppStack = createStackNavigator({
    // screens
    AllBlogs,
    SingleBlog
}, {
    // generic styling
    initialRouteName: 'AllBlogs',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#43005B'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }
});

const BlogsTab = createBottomTabNavigator(
    {
        Blogs: AppStack,
        AddBlog: createStackNavigator(
            {
                AddBlog
            }, 
            {
                defaultNavigationOptions: {
                    headerStyle: {
                        backgroundColor: '#43005B'
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }
            }
        )
    },
    {
        initialRouteName: 'Blogs',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor}) => {
                let { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Blogs') {
                    iconName = 'rss';
                } else if (routeName === 'AddBlog') {
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
            activeBackgroundColor: '#43005B',
            inactiveBackgroundColor: '#43005B',
            activeTintColor: 'white',
            inactiveTintColor: 'gray'
        }
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        App: BlogsTab,
        Auth: AuthStack,
        AuthLoading
    }, 
    {
        initialRouteName: 'AuthLoading'
    }
));