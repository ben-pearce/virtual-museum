
import React from 'react';

const UserContext = React.createContext({ 
  authenticated: false,
  setAuthenticated: () => {}
});

export default UserContext;