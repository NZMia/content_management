import React from 'react';

import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '0 15px' }}>
          <Link href="/">Home</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link href="/daily-record">Daily Record</Link>
        </li>
        <li style={{ margin: '0 15px' }}>
          <Link href="/blog">Blog</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
