import React, { useState } from 'react';
import cn from 'classnames';

export const ProductTable = ({
  products,
}) => {
  const [sortBy, setSortBy] = useState('id');
  const [isReversed, setIsReversed] = useState(false);

  const renderedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'id':
        return a.id - b.id;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'category':
        return a.category.title.localeCompare(b.category.title);
      case 'user':
        return a.user.name.localeCompare(b.user.name);
      default:
        return 0;
    }
  });

  if (isReversed) {
    renderedProducts.reverse();
  }

  const handleSortChange = (newSortBy) => {
    if (sortBy !== newSortBy) {
      setSortBy(newSortBy);
      setIsReversed(false);

      return;
    }

    if (!isReversed) {
      setIsReversed(true);

      return;
    }

    setSortBy('id');
    setIsReversed(false);
  };

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a
                href="#/"
                onClick={() => handleSortChange('id')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas',
                      { 'fa-sort': sortBy !== 'id',
                        'fa-sort-down': sortBy === 'id' && !isReversed,
                        'fa-sort-up': sortBy === 'id' && isReversed })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a
                href="#/"
                onClick={() => handleSortChange('name')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas',
                      { 'fa-sort': sortBy !== 'name',
                        'fa-sort-down': sortBy === 'name' && !isReversed,
                        'fa-sort-up': sortBy === 'name' && isReversed })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a
                href="#/"
                onClick={() => handleSortChange('category')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas',
                      { 'fa-sort': sortBy !== 'category',
                        'fa-sort-down': sortBy === 'category' && !isReversed,
                        'fa-sort-up': sortBy === 'category' && isReversed })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a
                href="#/"
                onClick={() => handleSortChange('user')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas',
                      { 'fa-sort': sortBy !== 'user',
                        'fa-sort-down': sortBy === 'user' && !isReversed,
                        'fa-sort-up': sortBy === 'user' && isReversed })}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {renderedProducts.map((product) => {
          const { id, name } = product;
          const { title: categoryName, icon: categoryIcon } = product.category;
          const fullCategoryName = `${categoryIcon} - ${categoryName}`;
          const { name: ownerName, sex: userSex } = product.user;
          const isOwnerMale = userSex === 'm';

          return (
            <tr data-cy="Product" key={id}>
              <td className="has-text-weight-bold" data-cy="ProductId">
                {id}
              </td>

              <td data-cy="ProductName">{name}</td>
              <td data-cy="ProductCategory">{fullCategoryName}</td>

              <td
                data-cy="ProductUser"
                // className="has-text-link"
                className={cn({
                  'has-text-link': isOwnerMale,
                  'has-text-danger': !isOwnerMale,
                })}
              >
                {ownerName}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
