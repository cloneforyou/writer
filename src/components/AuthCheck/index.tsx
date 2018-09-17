import * as React from 'react';
import * as PropTypes from 'prop-types';

class AuthCheck extends React.Component {
  render() {
    if (true) {
      return this.props.children;
    } else {
      return '需要登陆'
    }
  }
}
export default AuthCheck;