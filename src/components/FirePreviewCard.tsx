import * as React from 'react';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { json } from '../utils/api';

interface Props extends NavigationInjectedProps {
    fire: {
        id: number,
        lat: number,
        lon: number,
        userid: string,
        threat: string,
        photo: string,
        _created: Date
    },
    authorname: string,
    
}

interface State {
    locationText: string,
}

class FirePreviewCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          locationText: 'NA'
        }
      }

    componentDidMount() {
        this.getLocation();

    }

    getLocation = async () => {
        if (this.props.fire.lat) {
            try {

                let key = await json('https://report-wildfire-app.herokuapp.com/api/users/gmap/key');
                console.log(key);

                let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.props.fire.lat + ',' + this.props.fire.lon + '&sensor=true&key=' + key); 
                const location = await response.json();
                
                let locationText = location['plus_code']['compound_code'].substring(8);
                this.setState({locationText});
            } catch (e) {
                console.log('error getting phones gps location');
                throw e;
            }
        }
    }

    render () {   
        if (this.state.locationText != "NA") {
            const { id } = this.props.fire;
            let authorname = this.props.authorname;
            return (
                <Card
                    title={this.props.fire.threat + " Threat"}
                    image={{uri: 'https://images.newscientist.com/wp-content/uploads/2018/08/08114243/rexfeatures_9778243j.jpg'}}
                >
                    <Text style={{marginBottom: 10}}>{`Reported by ${authorname}`}</Text>
                    <Text style={{marginBottom: 10}}>{`Located in ${this.state.locationText}`}</Text>
                    <Button
                        icon={<Icon name='code' color='#ffffff' />}
                        buttonStyle={{ backgroundColor: '#36454f', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0 }}
                        title=' View this Fire'
                        onPress={() => this.props.navigation.navigate('SingleFire', {
                            itemId: id
                        })}
                    />
                </Card>
            );
        } else {
            return null;  
        }
    }
}

export default withNavigation(FirePreviewCard);