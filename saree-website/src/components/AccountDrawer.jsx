import React from 'react';
import './AccountDrawer.css';

function AccountDrawer({ currentUser, onLogout }) {
  return (
    <div className="account-drawer">
      <div className="drawer-header">
        <span className="drawer-email">{currentUser}</span>
      </div>
      <ul className="drawer-menu">
        <li className="drawer-item" onClick={onLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default AccountDrawer;