import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import axios from 'axios';

import * as Yup from 'yup';

import Config from '../../museum.config';

import { Deserializer } from 'jsonapi-serializer';

import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';

/**
 * Component for sign up form.
 */
class SignUp extends React.Component {

  static propTypes = {
    success: PropTypes.func.isRequired
  }

  /**
   * Form validation schema for sign up form. 
   *
   * Will be passed into Formik to validate user inputs.
   */
  static validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, 'Your name must be greater than 2 characters.')
      .max(50, 'Your name must be less than 50 characters.')
      .required('You must enter your first name.'),
    lastName: Yup.string()
      .min(3, 'Your name must be greater than 2 characters.')
      .max(50, 'Your name must be less than 50 characters.')
      .required('You must enter your last name.'),
    email: Yup.string()
      .email('Email address is invalid.')
      .required('You must enter an email address.'),
    password: Yup.string()
      .min(8, 'Your password must be greater than 8 characters in length.')
      .matches(/.*\d.*/, 'Your password must contain at least one number.')
      .matches(/.*[A-Z].*/, 'Your password must contain at least 1 uppercase letter.')
      .matches(/.*[a-z].*/, 'Your password must contain at least 1 lowercase letter.')
      .required('You must enter a password.'),
  });

  /**
   * Create sign up form component instance.
   *
   * @param {object} props Component properties.
   * @param {func} props.success Callback fired when sign up is successful and
   * user context has been updated.
   */
  constructor(props) {
    super(props);

    this.handleSignUpFormSubmit = this.handleSignUpFormSubmit.bind(this);
  }

  /**
   * Handles sign up form submission.
   *
   * Updates form state and initiates axios request to API.
   *
   * @param {object} values Form input values.
   * @param {func} param1.setSubmitting Function for setting form state to
   * submitting.
   */
  handleSignUpFormSubmit(values, { setSubmitting }) {
    setSubmitting(true);

    const formData = new URLSearchParams(values);

    axios.post('/signup', formData, { baseURL: Config.api.base }).then((r) => {
      new Deserializer({keyForAttribute: 'camelCase'}).deserialize(r.data).then((user) => {
        setSubmitting(false);
        this.props.success(user);
      });
    });
  }

  /**
   * Render sign up form. 
   *
   * Formik is responsible for basic input validation using the validation
   * schema.
   *
   * @returns {ReactNode} The {@link Formik} component.
   */
  render() {
    return (
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        validationSchema={SignUp.validationSchema}
        onSubmit={this.handleSignUpFormSubmit}>
        {({
          isSubmitting,
          touched,
          errors,
        }) => (
          <FormikForm>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Field
                as={Form.Control}
                type='text'
                name='firstName'
                placeholder='First Name'
                isInvalid={touched.firstName && errors.firstName}
                isValid={touched.firstName && !errors.firstName}/>
              <ErrorMessage 
                name='firstName'
                type='invalid'
                component={Form.Control.Feedback}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Field
                as={Form.Control}
                type='text'
                name='lastName'
                placeholder='Last Name'
                isInvalid={touched.lastName && errors.lastName}
                isValid={touched.lastName && !errors.lastName}/>
              <ErrorMessage 
                name='lastName'
                type='invalid'
                component={Form.Control.Feedback}/>
            </Form.Group>

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
                isValid={touched.password && !errors.password}/>
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

export default SignUp;