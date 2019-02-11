import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Button, Checkbox, Form, Input, Message } from 'semantic-ui-react'
import axios from 'axios';
import config from '../../config';

import './Signup.css';

import * as UserActions from '../../actions/User';

class Signup extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    isOwner: false,
    isRealtor: false,
    errors: {}
  }
  handleSubmit(e){
    e.preventDefault();

    let { first_name, last_name, email, password, password_confirm, isOwner, isRealtor } = this.state;

    let payload = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      password_confirm: password_confirm
    }
    if (isOwner) {
      payload.role = "owner"
    }else if (isRealtor) {
      payload.role = "realtor"
    }
    console.log(payload);
    axios.post(`${config.api.baseUrl}/api/users/register`, payload)
      .then(res => {
        localStorage.setItem('jwt', res.data.jwt);
        browserHistory.push('/listings');
        window.location.reload();
      })
      .catch(errors => {
        this.setState({errors: errors.response.data.errors});
      });
  }
  handleFirstNameChange(e){
    this.setState({first_name: e.target.value});
  }
  handleLastNameChange(e){
    this.setState({last_name: e.target.value});
  }
  handleEmailChange(e){
    this.setState({email: e.target.value});
  }
  handlePasswordChange(e){
    this.setState({password: e.target.value});
  }
  handlePasswordConfirmChange(e){
    this.setState({password_confirm: e.target.value});
  }
  renderErrors(){
    let { errors } = this.state;
    let msg = "";

    Object.keys(errors).forEach(item => {
      msg += `${errors[item].msg} \n`
    });
    return msg;
  }
  render(){
    let errors = this.renderErrors();
    if (this.props.user._id !== '') {
      browserHistory.push('/listings');
    }
    return (
      <div id="signup" className="text-center">
        <div className="signup-title">
          <h5 className="title">DIGZTR</h5>
          <h4 className="subtitle">THE NEXT GENERATION REAL ESTATE PLATFORM</h4>
          <span>Sign Up now for free</span>
        </div>
        <Form
          className="form-signup"
          onSubmit={e => this.handleSubmit(e)}
          >
          <Message
            error
            header="Sign Up Failed"
            visible={errors!==""}
            style={{whiteSpace:"pre-wrap"}}
            >
            {errors}
          </Message>
          <Form.Group widths='equal'>
            <Form.Input
              fluid
              placeholder='First name'
              onChange={e => this.handleFirstNameChange(e)}
              />
            <Form.Input
              fluid
              placeholder='Last name'
              onChange={e => this.handleLastNameChange(e)}
              />
          </Form.Group>
          <Form.Input
            fluid
            placeholder='Email Address'
            type="email"
            onChange={e => this.handleEmailChange(e)}
            />
          <Form.Input
            fluid
            placeholder='Password'
            type="password"
            onChange={e => this.handlePasswordChange(e)}
            />
          <Form.Input
            fluid
            placeholder='Confirm Password'
            type="password"
            onChange={e => this.handlePasswordConfirmChange(e)}
            />
          <Form.Checkbox
            className="no-margin"
            label="You are home owner/buyer"
            checked={this.state.isOwner}
            onChange={() => this.setState({isOwner: !this.state.isOwner})}
            />
          <Form.Checkbox
            className="no-margin"
            label="You are realtor/agency"
            checked={this.state.isRealtor}
            onChange={() => this.setState({isRealtor: !this.state.isRealtor})}
            />

          <div>
            <a>Already have account? Login Now</a>
          </div>

          <Button
            fluid
            type="submit"
            className="signup-btn"
            >
            Sign Up
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.User
}))(Signup);
