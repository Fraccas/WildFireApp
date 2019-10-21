import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenOptions } from 'react-navigation';

interface Props {}
interface State {}

export default class Test extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        title: 'Test'
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 25, color: 'black' }}>
                    Test Screen Component
                </Text>
            </View>
        );
    }
}