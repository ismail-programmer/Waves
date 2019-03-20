import React from 'react';
import UserLayout from '../../hoc/user';
import MyButton from '../utils/button';
import moment from 'moment';

const UserDashboard = ({ user }) => {
  const renderHistory = history => {
    if (history)
      return (
        <div className='user_nfo_panel'>
          <h1>History Of Purchases</h1>
          <div className='user_product_block_wrapper'>
            <div className='history_block'>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price Paid</th>
                    <th>Date of Purchases</th>
                  </tr>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>
                        {item.brand.name}&nbsp;{item.name}
                      </td>
                      <td>{item.quantity}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}</td>
                      <td>
                        {moment(item.dateOfPurchase).format('LL')}&nbsp;-&nbsp;
                        {moment(item.dateOfPurchase).format('LT')}
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
        </div>
      );
  };

  return (
    <UserLayout>
      <div>
        <div className='user_nfo_panel'>
          <h1>User Information</h1>
          <div>
            <span>{user.userData.firstname}</span>
            <span>{user.userData.lasttname}</span>
            <span>{user.userData.email}</span>
          </div>
          <MyButton
            type='default'
            title='Edit account info'
            linkTo='/user/user_profile'
          />
        </div>
        {renderHistory(user.userData.history)}
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
