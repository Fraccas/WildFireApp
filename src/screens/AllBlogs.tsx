import * as React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { NavigationScreenOptions, NavigationEvents } from 'react-navigation';
import { json } from '../utils/api';
import BlogPreviewCard from '../components/BlogPreviewCard';

interface IHomeProps extends NavigationStackScreenProps { }
interface IHomeState {
  blogs: {
    id: number,
    title: string,
    content: string,
    authorid: string,
    _created: Date
  }[],
  authors: Array<string>;
}

export default class AllBlogs extends React.Component<IHomeProps, IHomeState> {
  static navigationOptions: NavigationScreenOptions = {
    headerTitle: "Blogs"
  };

  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      blogs: [],
      authors: []
    }
    this._getBlogs();
  }

  async _getBlogs() {
    try {
      let blogs = await json('https://afternoon-basin-48933.herokuapp.com/api/blogs'); 
      this.setState({blogs})

      // set author names from db
      this._setAuthors();

    } catch (e) {
      console.log(e);
      Alert.alert("Error on front end api request!");
    }
  }

    async _setAuthors() {
      try {
        let authors: Array<string> = [];
        for (let blog of this.state.blogs) {
          let author = await json('https://afternoon-basin-48933.herokuapp.com/api/authors/name/' + blog.authorid); 
          authors.push(author[0]['name']);
        }
        this.setState({authors});
    } catch (e) {
      console.log(e); 
    }
  }

  renderBlogs() {
    return this.state.blogs.map((blog, index) => { 
      if (this.state.authors[index]) {
        return <BlogPreviewCard key={blog.id} blog={blog} authorname={this.state.authors[index]} />
      }
    });
  }

  render () { 
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => this._getBlogs()} />
        <Text style={styles.text}>All Blogs Screen</Text>
          <ScrollView style={{width: '90%'}}>
            {this.renderBlogs()}
          </ScrollView>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 25,
    margin: 5,
    fontFamily: 'Cochin'
  }
});
