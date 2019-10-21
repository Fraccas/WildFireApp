import * as React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { NavigationScreenOptions, NavigationParams } from 'react-navigation';
import { json } from '../utils/api';

interface Props extends NavigationParams {}
interface State {
  blog: {
    id: number,
    title: string,
    content: string,
    authorid: string,
    _created: Date
  }, tag: string
}

export default class SingleBlog extends React.Component<Props, State> {

    static navigationOptions: NavigationScreenOptions = {
        headerTitle: "Single Blog"
    };

    constructor(props: Props) {
      super(props);
      this.state = {
        blog: {id: 0, title: 'test', content: '', authorid: '', _created: new Date()},
        tag: ''
      };
    }

    async componentDidMount() {
      try {
        const itemId = this.props.navigation.getParam('itemId', 'NO-ID');
        let blog = await json('https://afternoon-basin-48933.herokuapp.com/api/blogs/' + itemId); 
        let tag = await json('https://afternoon-basin-48933.herokuapp.com/api/blogs/tags/' + itemId); 

        this.setState({blog: blog[0], tag: tag[0][0]['name']});
      } catch (e) {
        console.log(e);
        Alert.alert("Error on front end api request!");
      }
    }

    render() {
      const {title, content, authorid, _created} = this.state.blog;
      let tagN = this.state.tag;
      return (
        
          <View style={styles.container}>
            <Text style={styles.titleStyle}>{title}</Text>
            <Text style={styles.tagStyle}>{this.state.tag}</Text>
            <ScrollView>
            <View style={styles.container}>
                <Text style={styles.bodyTextStyle}>{content}</Text>
            </View>
            </ScrollView>
          </View>

      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    textAlign: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid'
  },
  titleStyle: {
    marginTop: 15,
    textAlign: 'center',
    color: '#FA6BFF',
    fontSize: 35
  },
  tagStyle: {
    margin: 15,
    textAlign: 'center', 
    fontSize: 10,
    color: 'black',
    padding: 15,
    backgroundColor: '#46FFA4',
    borderWidth: 2,
    borderColor: '#000',
    borderStyle: 'solid'
  },
  text: {
    fontSize: 15,
    color: 'black',
    backgroundColor: 'white',
    lineHeight: 55
  },
  bodyTextStyle: {
    color: '#000',
    fontSize: 17,
    lineHeight: 25
  },
});
