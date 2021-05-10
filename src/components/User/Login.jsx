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

/**
 * Component for login form.
 */
class Login extends React.Component {

  static propTypes = {
    success: PropTypes.func.isRequired
  }

  /**
   * Form validation schema for login form. 
   *
   * Will be passed into Formik to validate user inputs.
   */
  static validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email address is invalid.')
      .required('You must enter an email address.'),
    password: Yup.string()
      .required('You must enter a password.'),
  });

  /**
   * Create login form component instance.
   *
   * @param {object} props Component properties.
   * @param {func} props.success Callback fired when login is successful and
   * user context has been updated.
   */
  constructor(props) {
    super(props);

    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.handleOnLoginSuccess = this.handleOnLoginSuccess.bind(this);
    this.handleOnLoginError = this.handleOnLoginError.bind(this);
  }

  /**
   * Sets the form to submission state and initiates axios request to API for
   * authentication.
   *
   * @param {object} values Form input values.
   * @param {object} actions Formik object provides API access.
   */
  handleLoginFormSubmit(values, actions) {
    actions.setSubmitting(true);
    const formData = new URLSearchParams(values);

    axios.post('/login', formData, { baseURL: Config.api.base })
      .then(r => this.handleOnLoginSuccess(r, actions))
      .catch(r => this.handleOnLoginError(r, actions));
  }

  /**
   * Handles login form success and invokes the {@link Login#success} callback.
   * 
   * @param {string} resp Raw API response.
   * @param {func} param1.setSubmitting Function for setting form state to
   * submitting.
   */
  handleOnLoginSuccess(resp, { setSubmitting }) {
    new Deserializer({keyForAttribute: 'camelCase'}).deserialize(resp.data).then((user) => {
      setSubmitting(false);
      this.props.success(user);
    });
  }

  /**
   * Handles login form failure.
   * 
   * @param {string} resp Raw API response.
   * @param {func} param1.setSubmitting Function for setting form state to
   * submitting.
   */
  handleOnLoginError(resp, { setSubmitting }) {
    setSubmitting(false);
  }

  /**
   * Render login form. 
   *
   * Formik is responsible for basic input validation using the validation
   * schema.
   *
   * @returns {ReactNode} The {@link Formik} component.
   */
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