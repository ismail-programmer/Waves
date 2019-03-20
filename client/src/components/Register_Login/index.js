import React from 'react';
import MyButton from '../utils/button';
import Login from './login';

const RegisterLogin = () => {
  return (
    <div className='page_wrapper'>
      <div className='container'>
        <div className='register_login_container'>
          <div className='left'>
            <h1>New Customers</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, laborum corrupti! Doloribus nam obcaecati
              consequuntur molestias quasi omnis voluptate unde quo? Praesentium debitis tempora fuga magni pariatur
              consequatur doloribus incidunt!
            </p>
            <MyButton
              type='default'
              title='Create an account'
              linkTo='/register'
              addStyle={{
                margin: '10px 0 0 0'
              }}
            />
          </div>
          <div className='right'>
            <h2>Register Customers</h2>
            <p>If you have an account.Please login.</p>
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
