import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
// import { Auth } from 'aws-amplify';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [message, setMessage] = React.useState<string>('');

    const signUpValidationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const handleSignUp = async (values: { email: string; password: string; confirmPassword: string }) => {
        try {
            // await Auth.signUp({ username: values.email, password: values.password });
            setMessage('Sign-up successful! Check your email for confirmation.');
            navigation.navigate('Login');
        } catch (error) {
            setMessage(error.message || 'Error signing up.');
        }
    };

    return (
        <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            validationSchema={signUpValidationSchema}
            onSubmit={handleSignUp}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.title}>Sign Up</Text>
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
                    <TextInput
                        label="Confirm Password"
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        style={styles.input}
                        secureTextEntry
                        error={touched.confirmPassword && !!errors.confirmPassword}
                    />
                    {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                    <Button mode="contained" onPress={handleSubmit as any} style={styles.button}>
                        Sign Up
                    </Button>
                    <Button onPress={() => navigation.navigate('Login')} style={styles.link}>
                        Already have an account? Login
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

export default SignUpScreen;
