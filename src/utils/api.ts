import { AsyncStorage } from 'react-native';

export let GetAccessToken = async () => {
    let token: any = await AsyncStorage.getItem('token');
    return token;
}

export let GetUser = async() => {
    let user: any = await AsyncStorage.getItem('user');
    return JSON.parse(user); // user was saved as string
}

export let ClearUser = () => {
    AsyncStorage.clear();
}

export const json = async <T = any>(uri: string, method: string = "GET", body?: {}) => {
    let headers: any = {
        'Content-type': 'application/json'
    };

    let token = await GetAccessToken();
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

export const SetAccessToken = async (token: string, user: {userid: undefined, name: 'undefined', role: 'undefined', phone: 'undefined', email: 'undefined'}) => {
    console.log(user);
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
}

export const SetEmail = async (email: string) => {
    await AsyncStorage.setItem('email', email);
}

export const GetEmail = async() => {
    let email: any = await AsyncStorage.getItem('email');
    return email;
}

export const SetPhone = async (phone: string) => {
    await AsyncStorage.setItem('phone', phone);
}

export const GetPhone = async() => {
    let phone: any = await AsyncStorage.getItem('phone');
    return phone;
}