import * as React from 'react';

const Footer = () => {
  return (
    <footer>
      <div>
        <p>
          {' '}
          &copy; {new Date().getFullYear()} My Blog. All rights reserved. MIT
          Licensed{' '}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
