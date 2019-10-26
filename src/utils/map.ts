import { json } from '../utils/api';

export let getLocationText = async (lat: number, lon: number) => {
    if (lat && lon) {
        try {
            let key = await json('https://report-wildfire-app.herokuapp.com/api/users/gmap/key');

            let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true&key=' + key); 
            const location = await response.json();
            
            if (location['plus_code']['compound_code']) { // api simple county/state/country tag
                let locationText: string = location['plus_code']['compound_code'].substring(8);
                return locationText;
            } else if (location['results'][0]['formatted_address']) { // not all have compound_code. this gives
                return location['results'][0]['formatted_address'];   // an alt location description
            } else {
                console.log();
                return 'Location Error'; // no location data avaiable 
            }
        } catch (e) {
            console.log('error getting phones gps location - Fraccas');
            throw e;
        }
    } else {
        console.log('invalid params for location match in map util - Fraccas');
    }
}
