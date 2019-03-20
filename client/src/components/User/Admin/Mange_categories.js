import React from 'react';
import UserLayout from '../../../hoc/user';
import ManageBrands from './Manage_brands';
import ManageWoods from './Manage_woods';

const ManageCategories = () => {
  return (
    <UserLayout>
      <ManageBrands />
      <ManageWoods />
    </UserLayout>
  );
};

export default ManageCategories;
