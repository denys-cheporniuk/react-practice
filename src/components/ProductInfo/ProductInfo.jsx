import React from 'react';
import classNames from 'classnames';

export const ProductInfo = ({ product }) => {
  const {
    id,
    name,
    category,
    user,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">{name}</td>
      <td data-cy="ProductCategory">
        {`${category.icon} - ${category.name}`}
      </td>

      <td
        data-cy="ProductUser"
        className={classNames({
          'has-text-danger': user.sex === 'f',
          'has-text-link': user.sex === 'm',
        })}
      >
        {user.name}
      </td>
    </tr>
  );
};
