import React, { useState } from 'react';
import cd from 'classnames';

import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = [...categoriesFromServer]
    .find(cat => cat.id === product.categoryId)
    || null; // find by product.categoryId
  const user = [...usersFromServer]
    .find(owner => owner.id === category.ownerId)
    || null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [userId, setUserId] = useState(null);
  const [searchField, setSearchField] = useState('');

  let visibleProducts = [...products];

  if (userId) {
    visibleProducts = visibleProducts
      .filter(product => product.user.id === userId);
  }

  if (searchField) {
    visibleProducts = visibleProducts
      .filter(product => product.name.toLowerCase()
        .includes(searchField.toLowerCase()));
  }

  const handleChangeUser = (user) => {
    if (user) {
      setUserId(user.id);

      return;
    }

    setUserId(null);
  };

  const handleSearchField = (event) => {
    setSearchField(event.target.value);
  };

  const isVisibleProd = () => visibleProducts.length !== 0;

  const handleResetAll = () => {
    setUserId(null);
    setSearchField('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cd({
                  'is-active': userId === null,
                })}
                onClick={(event) => {
                  event.preventDefault();
                  handleChangeUser(null);
                }}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={cd({
                    'is-active': user.id === userId,
                  })}
                  onClick={(event) => {
                    event.preventDefault();
                    handleChangeUser(user);
                  }}
                  key={user.id}
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
                  value={searchField}
                  onChange={handleSearchField}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {searchField && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={(event) => {
                        event.preventDefault();
                        setSearchField('');
                      }}
                    />
                  )}

                </span>
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

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!isVisibleProd() && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

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
              {visibleProducts.map(product => (

                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {`${product.category.icon} - ${product.category.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={cd('has-text-link', {
                      'has-text-link': product.user.sex === 'm',
                      'has-text-danger': product.user.sex === 'f',
                    })}
                  >
                    {product.user.name}
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
