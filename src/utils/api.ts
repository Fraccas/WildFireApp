import { AsyncStorage } from 'react-native';

export let getAccessToken = async () => {
    let token: any = await AsyncStorage.getItem('token');
    return token;
}

export let getUser = async() => {
    let user: any = await AsyncStorage.getItem('user');
    return JSON.parse(user); // user was saved as string
}

export const json = async <T = any>(uri: string, method: string = "GET", body?: {}) => {
    let headers: any = {
        'Content-type': 'application/json'
    };

    let token = await getAccessToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        let result = await fetch(uri, {
            method,
            headers,
            body: JSON.stringify(body)
        });
        if (result.ok) {
            return <T>(await result.json());
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

export const SetAccessToken = async (token: string, user: {userid: undefined, role: 'undefined'}) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
}