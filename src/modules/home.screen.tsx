import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// import { Auth } from 'aws-amplify';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const handleLogout = async () => {
        // await Auth.signOut();
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the App!</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
