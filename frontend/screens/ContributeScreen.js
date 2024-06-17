import React from 'react';
import { Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
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

const ContributionScreen = () => {
  const route = useRoute();
  const { campaignId } = route.params;

  const handleContribute = async (values) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/campaigns/contribute/${campaignId}`, {
        amount: values.amount,
        token: 'your_stripe_token', // Obtain this token from Stripe.js or React Native Stripe SDK
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ amount: '' }}
        validationSchema={Yup.object({
          amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
        })}
        onSubmit={handleContribute}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <Input
              placeholder="Amount"
              onChangeText={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
            />
            {touched.amount && errors.amount ? <ErrorText>{errors.amount}</ErrorText> : null}
            <Button title="Contribute" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ContributionScreen;
