import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
// import { Auth } from 'aws-amplify';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [message, setMessage] = React.useState<string>('');

    const loginValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            // await Auth.signIn(values.email, values.password);
            setMessage('Login successful!');
            setTimeout(()=> navigation.navigate('Home'), 2000);
        } catch (error) {
            setMessage(error.message || 'Error logging in.');
        }
    };

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                    <TextInput
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        style={styles.input}
                        keyboardType="email-address"
                        error={touched.email && !!errors.email}
                    />
                    {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                    <TextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        style={styles.input}
                        secureTextEntry
                        error={touched.password && !!errors.password}
                    />
                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                    <Button mode="contained" onPress={handleSubmit as any} style={styles.button}>
                        Login
                    </Button>
                    <Button onPress={() => navigation.navigate('SignUp')} style={styles.link}>
                        Don't have an account? Sign Up
                    </Button>
                    <Snackbar visible={!!message} onDismiss={() => setMessage('')} duration={3000}>
                        {message}
                    </Snackbar>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    link: {
        marginTop: 15,
    },
});

export default LoginScreen;
