import React from "react";

export const Container = props => (
  <div style={{
      width: '1480px', 
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      }}>
    {props.children}
  </div>
);

export default Container;