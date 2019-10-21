import * as React from 'react';
import { StyleSheet, View, Alert, Picker, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions } from 'react-navigation';
import { Input, Button, Text } from 'react-native-elements';
import { getUser, json } from '../utils/api';

interface Props extends NavigationStackScreenProps {}
interface State {
    title: string,
    content: string,
    tags: {
        id: string,
        name: string
    }[];
    selectedTag: number;
}

export default class AddBlog extends React.Component<Props, State> {
    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Add Blog"
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            tags: [],
            selectedTag: 0
        };
    }

    private saving: boolean = false;

    async componentDidMount() {
        try {
            let tags = await json('https://afternoon-basin-48933.herokuapp.com/api/blogs/alltags');
            this.setState({tags});
        } catch (e) {
            console.log(e);
            Alert.alert('Error getting tags');
        }
    }

    async handleSubmit() {
        if (this.saving) return; // already clicked, don't rerun logic

        if (!this.state.title || !this.state.content) {
            Alert.alert("Please fill out all inputs!");
            return;
        }

        let newBlog = {
            title: this.state.title,
            body: this.state.content,
            authorid: null,
            tagid: this.state.selectedTag
        }

        try {
            this.saving = true;

            let { userid } = await getUser();
            newBlog.authorid = userid;

            let result = await json(`https://afternoon-basin-48933.herokuapp.com/api/blogs/post/${newBlog.title}/${newBlog.body}/${newBlog.authorid}/${newBlog.tagid}`, 'POST', newBlog);
            
            if (result) {
                this.setState({
                    title: '', 
                    content: ''
                });
                this.props.navigation.navigate('AllBlogs');
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error adding new blog!');
        } finally {
            this.saving = false;
        }
    }

    render () {
        return (
            <ScrollView>
            <View style={styles.container}>
                <Input
                    label="Title"
                    containerStyle={styles.container}
                    inputContainerStyle={{borderBottomWidth: 0}}
                    leftIcon={{type: 'font-awesome', name: 'exclamation', color: '#430058'}}
                    placeholder="Blog title..."
                    value={this.state.title}
                    onChangeText={(text) => this.setState({title: text})}
                />
                
                <Input 
                    label="Content"
                    containerStyle={styles.container}
                    inputContainerStyle={{borderBottomWidth: 0}}
                    multiline
                    numberOfLines={5}
                    leftIcon={{type: 'font-awesome', name: 'file-text', color: '#43005B'}}
                    placeholder="Blog content..."
                    value={this.state.content}
                    onChangeText={(text) => this.setState({content: text})}
                />
                <Text style={styles.customLabel}>Tags</Text>
                <View style={styles.pickerContainer}>
                    
                    <Picker
                        style={{height: 200, width: 200}}
                        selectedValue={this.state.selectedTag}
                        onValueChange={(itemValue) => this.setState({selectedTag: itemValue})}
                    >
                        {this.state.tags.map(tag => (
                            <Picker.Item key={tag.id} label={`${tag.name}`} value={tag.id}/>
                        ))}
                    </Picker>                 
                </View>

                <Button
                    raised
                    title="Submit"
                    containerStyle={{margin: 10}}
                    buttonStyle={styles.buttonStyle}
                    onPress={() => this.handleSubmit()}
                />
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'purple',
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'solid',
        margin: 15,
        padding: 10
      },
      pickerContainer: {
        flex: 1
      },
      text: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 25,
        margin: 5,
        fontFamily: 'Cochin'
      },
      buttonStyle: {
          backgroundColor: '#AE3CD7',
          borderWidth: 2,
          borderColor: '#43005B',
          width: '100%'
      },
      customLabel: {
          fontWeight: 'bold',
          fontSize: 24,
          color: '#86939e'
      }
});