import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Login from './components/Login';

import * as UserActions from './actions/User';

const ListingList = require('./routes/ListingList/ListingList').default;

class Header extends Component {
  render(){
    return(
      <Nav
        user={this.props.user}
        />
    );
  }
}

class App extends Component {
  componentDidMount() {
    let { dispatch } = this.props;
    let jwt = localStorage.getItem('jwt');

    if (jwt && jwt !== '') {
      dispatch(UserActions.checkJWT(jwt));
    }
    window.FB.getLoginStatus(res => {
      console.log(res);
    });
  }
  render() {
    return (
      <div id="root">
        <Header
          user={this.props.user}
          />
        <div>
        <Login />
        {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(state => ({
  user: state.User
}))(App);
