import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [ownerId, setOwnerId] = useState(0);
  const [query, setQuery] = useState('');

  const handleChangeQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  const handleResetFilters = (event) => {
    event.preventDefault();
    setQuery('');
    setOwnerId(0);
  };

  const getUserById = (userId) => {
    const foundUser = usersFromServer.find(user => user.id === userId);

    return foundUser;
  };

  const getCategoryById = (categoryId) => {
    const foundCategory = categoriesFromServer
      .find(category => category.id === categoryId);

    return foundCategory;
  };

  const products = productsFromServer
    .map((product) => {
      const category = getCategoryById(product.categoryId);
      const user = getUserById(category.ownerId);

      return ({
        ...product,
        category,
        user,
      });
    })
    .filter(product => product.name.toLowerCase()
      .includes(query.toLowerCase()))
    .filter(product => product.user.id === ownerId || ownerId === 0);

  const showClearButton = query.length > 0;
  const hasAnyProduct = products.length > 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={ownerId === 0 && 'is-active'}
                onClick={(event) => {
                  event.preventDefault();
                  setOwnerId(0);
                }}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  className={ownerId === user.id && 'is-active'}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={(event) => {
                    event.preventDefault();
                    setOwnerId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleChangeQuery}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {showClearButton && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      onClick={handleClearQuery}
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}

              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={handleResetFilters}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!hasAnyProduct ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={product.user.sex === 'm'
                        ? 'has-text-link' : 'has-text-danger'}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>

          )}

        </div>
      </div>
    </div>
  );
};
