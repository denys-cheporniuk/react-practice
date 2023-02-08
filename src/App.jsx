import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const findCategoryById = (id) => {
  const res = categoriesFromServer.find(category => category.id === id);

  return res || null;
};

const findUserById = (id) => {
  const res = usersFromServer.find(user => user.id === id);

  return res || null;
};

const preparedProducts = productsFromServer.map((product) => {
  const category = findCategoryById(product.categoryId);
  const user = findUserById(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(0);
  let visibleProducts = preparedProducts;

  const handleQuery = (event) => {
    setQuery(event.target.value);
  };

  if (selectedUser.length !== 0) {
    visibleProducts = preparedProducts.filter(product => (
      selectedUser.id === product.user.id
    ));
  }

  if (query !== '') {
    visibleProducts = preparedProducts.filter(product => (
      product.name.toLocaleLowerCase().includes(query.trim().toLowerCase())
    ));
  }

  if (category) {
    visibleProducts = preparedProducts
      .filter(products => products.categoryId === category);
  }

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
                className={cn({
                  'is-active': selectedUser.length === 0,
                })}
                onClick={() => {
                  setSelectedUser([]);
                }}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const isUserSelected = Boolean(user.id === selectedUser.id);

                return (
                  <a
                    key={user.id}
                    data-cy="FilterAllUsers"
                    href="#/"
                    className={cn({
                      'is-active': isUserSelected,
                    })}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  >
                    {user.name}
                  </a>
                );
              })
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handleQuery}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => {
                      setQuery('');
                    }}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => {
                  setCategory(0);
                }}
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
                onClick={() => {
                  setCategory(1);
                }}
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
                onClick={() => {
                  setCategory(2);
                }}
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
                onClick={() => {
                  setCategory(3);
                }}
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
                onClick={() => {
                  setCategory(4);
                }}
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
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
          {visibleProducts.length === 0 && (
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
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className="has-text-link"
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
