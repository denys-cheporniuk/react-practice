import classNames from 'classnames';
import React from 'react';

export const Product = ({ product }) => {
  const {
    id,
    productName,
    categoryName,
    user,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{productName}</td>
      <td data-cy="ProductCategory">{categoryName}</td>

      <td
        data-cy="ProductUser"
        className={classNames({
          'has-text-link': user.sex === 'm',
          'has-text-danger': user.sex === 'f',
        })}
      >
        {user}
      </td>
    </tr>
  );
};
