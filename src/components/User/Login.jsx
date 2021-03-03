import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import axios from 'axios';

import * as Yup from 'yup';

import { Deserializer } from 'jsonapi-serializer';

import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';

import Config from '../../museum.config';

class Login extends React.Component {

  static propTypes = {
    success: PropTypes.func.isRequired
  }

  static validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email address is invalid.')
      .required('You must enter an email address.'),
    password: Yup.string()
      .required('You must enter a password.'),
  });

  constructor(props) {
    super(props);

    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
  }

  handleLoginFormSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    const formData = new URLSearchParams(values);

    axios.post('/login', formData, { baseURL: Config.api.base }).then((r) => {
      new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data).then((user) => {
        setSubmitting(false);
        this.props.success(user);
      });
    });
  }

  render() {
    return (
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Login.validationSchema}
        onSubmit={this.handleLoginFormSubmit}>
        {({
          isSubmitting,
          touched,
          errors,
        }) => (
          <FormikForm>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Field
                as={Form.Control}
                type='email'
                name='email'
                placeholder='Email'
                isInvalid={touched.email && errors.email}
                isValid={touched.email && !errors.email}/>
              <ErrorMessage 
                name='email'
                type='invalid'
                component={Form.Control.Feedback}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Field 
                as={Form.Control}
                name='password' 
                type='password' 
                placeholder='Password'
                isInvalid={touched.password && errors.password}
                isValid={touched.password && !errors.passwors}/>
              <ErrorMessage 
                name='password' 
                type='invalid'
                component={Form.Control.Feedback}/>
            </Form.Group>
            <Button 
              variant='primary' 
              type='submit' 
              className='float-right d-flex align-items-center' 
              disabled={isSubmitting}>
              Submit {isSubmitting && 
              <Spinner 
                className='ml-2' 
                animation='border' 
                size='sm' 
                variant='light' />}
            </Button>
          </FormikForm>
        )}
      </Formik>
    );
  }
}

export default Login;