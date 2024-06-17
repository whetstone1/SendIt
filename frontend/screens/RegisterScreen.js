import React from 'react';
import { Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const RegisterScreen = ({ navigation }) => {
  const handleRegister = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', values);
      // Save token and navigate to dashboard
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        })}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
            <Input
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
            <Input
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password ? <ErrorText>{errors.password}</ErrorText> : null}
            <Button title="Register" onPress={handleSubmit} />
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default RegisterScreen;
