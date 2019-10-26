import * as React from 'react';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { getLocationText } from '../utils/map';

interface Props extends NavigationInjectedProps {
    apifire: {
        id: string,
        title: string,
        published: string,
        link: string,
        lat: number,
        lon: number,
        distanceFromUser: number,
        description: string
    }
    
}

interface State {
    locationText: string,
}

class ApiFirePreviewCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          locationText: 'NA'
        }
      }

    async componentDidMount() {
        let locText:string = await getLocationText(this.props.apifire.lat, this.props.apifire.lon) as string;
        this.setState({locationText: locText});
    }

    render () {   
        if (this.state.locationText != "NA") {
            const id = 'apifire-' + this.props.apifire.id;
            return (
                <Card
                    title={this.props.apifire.title[0]}
                    image={{uri: 'https://images.newscientist.com/wp-content/uploads/2018/08/08114243/rexfeatures_9778243j.jpg'}}
                >
                    <Text style={{marginBottom: 10, fontWeight: "bold"}}>{`Distance from you: ${this.props.apifire.distanceFromUser} miles`}</Text>
                    <Text style={{marginBottom: 10}}>{`Located in ${this.state.locationText}`}</Text>
                    <Text style={{marginBottom: 10}}>{`${this.props.apifire.published}`}</Text>
                    <Button
                        icon={<Icon name='info' color='#ffffff' />}
                        buttonStyle={{ backgroundColor: '#36454f', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0 }}
                        title=' View More Info'
                        onPress={() => this.props.navigation.navigate('SingleFire', {
                            apiFire: this.props.apifire, location: this.state.locationText,
                        })}
                    />
                </Card>
            );
        } else {
            return null;  
        }
    }
}

export default withNavigation(ApiFirePreviewCard);