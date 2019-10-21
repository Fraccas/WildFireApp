import * as React from 'react';
import { Text, Card, Button, Icon } from 'react-native-elements';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';

interface Props extends NavigationInjectedProps {
    blog: {
        id: number,
        title: string,
        content: string,
        authorid: string,
        _created: Date
    },
    authorname: string
}

interface State {}

class BlogPreviewCard extends React.Component<Props, State> {
    render () {
        const { id, title } = this.props.blog;
        let authorname = this.props.authorname;
        return (
            <Card
                title={title}
                image={{uri: 'https://i.pinimg.com/originals/e4/f2/c8/e4f2c8ca0fdf2fc2994a0be74b8a7d7d.jpg'}}
            >
                <Text style={{marginBottom: 10}}>{`Written by:\n\n${authorname}`}</Text>
                <Button
                    icon={<Icon name='code' color='#ffffff' />}
                    buttonStyle={{ backgroundColor: '#AE3CD7', borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: 0 }}
                    title=' Read this Blog'
                    onPress={() => this.props.navigation.navigate('SingleBlog', {
                        itemId: id
                    })}
                />
            </Card>
        );
    }
}

export default withNavigation(BlogPreviewCard);