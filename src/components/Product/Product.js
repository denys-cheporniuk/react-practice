import classNames from 'classnames';
import React from 'react';

export const Product = ({ product }) => (
  <>
    <td className="has-text-weight-bold" data-cy="ProductId">
      {product.id}
    </td>

    <td data-cy="ProductName">
      {product.name}
    </td>
    <td data-cy="ProductCategory">
      {`${product.category.icon} - ${product.category.title}`}
    </td>

    <td
      data-cy="ProductUser"
      className={classNames({
        'has-text-link': product.user.sex === 'm',
        'has-text-danger': product.user.sex === 'f',
      })}
    >
      {product.user.name}
    </td>
  </>
);
