import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

class ObjectPage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (<h2>{this.props.match.params.objectId}</h2>);
  }
}

export default withRouter(ObjectPage);