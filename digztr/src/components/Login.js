import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { Message } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config';
import * as UserActions from '../actions/User';

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
  }
  handleFBLogin(){
    const { dispatch } = this.props;
    if (window.hasOwnProperty('FB')) {
      window.FB.login(
        res => {
          if (res.status === 'connected') {
            dispatch(UserActions.fbLogin(res));
          }
        },
        {
          scope: 'public_profile,email',
          auth_type: 'rerequest',
        },
      );
    }
  }
  handleLogin(e) {
    e.preventDefault();

    let { email, password } = this.state;

    let data = {
      email: email,
      password: password
    };

    axios.post(`${config.api.baseUrl}/api/users`,data)
      .then(res => {
        localStorage.setItem('jwt', res.data.jwt);
        browserHistory.push('/listings');
        window.location.reload();
      })
      .catch(errors => {
        this.setState({errors:errors.response.data.errors});
      });
  }
  handleEmailChange(e) {
    this.setState({email:e.target.value});
  }
  handlePasswordChange(e) {
    this.setState({password:e.target.value});
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
    console.log(errors);
    return (
      <div id="login">
        <div id="loginModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <div class="login-title">
                  <h1>Welcome Back</h1>
                  <p>Log in to save homes and get alerts about new listings.</p>
                </div>

                <form class="login-form" onSubmit={e => this.handleLogin(e)}>
                  <Message
                    error
                    header="Sign Up Failed"
                    visible={errors!==""}
                    style={{whiteSpace:"pre-wrap"}}
                    >
                    {errors}
                  </Message>
                  <div class="form-group">
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Email"
                      onChange={e => this.handleEmailChange(e)}
                      />
                  </div>
                  <div class="form-group">
                    <input
                      class="form-control"
                      type="password"
                      placeholder="Password"
                      onChange={e => this.handlePasswordChange(e)}
                      />
                  </div>

                  <div class="row login-submit">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input
                          class=""
                          type="checkbox"
                          />
                        <span>Remember me</span>
                      </div>
                    </div>
                    <div class="col-md-6">
                    <button class="btn btn-white pull-right" type="submit">Sign In</button>

                    </div>
                  </div>
                </form>
                <div class="row links">
                  <div class="col-md-6" style={{borderRight: "1px solid gray"}}>
                    <a class="register-btn" href="/signup">Register now</a>
                  </div>
                  <div class="col-md-6">
                    <a class="forgot-btn">Forgot password?</a>
                  </div>
                </div>


                <div class="row well social-links">
                  <div class="btn-group btn-block">
                    <button
                      class="btn btn-primary"
                      onClick={() => this.handleFBLogin()}
                      data-dismiss="modal"
                      >
                      Log in with Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.User
}))(Login);
