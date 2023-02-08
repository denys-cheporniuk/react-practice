import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategory = categoryId => categoriesFromServer
  .find(category => category.id === categoryId);

const getUser = ownerId => usersFromServer.find(user => user.id === ownerId);

const products = productsFromServer.map((product) => {
  const foundCategory = getCategory(product.categoryId) || null;
  const foundUser = getUser(foundCategory.ownerId) || null;

  return {
    ...product,
    category: foundCategory,
    user: foundUser,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');

  const handleAllUsers = (event) => {
    event.preventDefault();

    setSelectedUserId(0);
  };

  const clearQuery = () => {
    setQuery('');
  };

  const resetAllFilters = () => {
    setSelectedUserId(0);
    setQuery('');
  };

  const filteredProductsByUser = products.filter(product => (
    (selectedUserId)
      ? product.user.id === selectedUserId
      : product
  )) || null;

  const searchedProducts = filteredProductsByUser.filter((product) => {
    const lowerName = product.name.toLowerCase();
    const lowerQuery = query.toLowerCase();

    return (query)
      ? lowerName.includes(lowerQuery)
      : product;
  }) || null;

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
                className={classNames({ 'is-active': selectedUserId === 0 })}
                value={selectedUserId}
                onClick={handleAllUsers}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { id, name } = user;

                return (
                  <a
                    key={id}
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames({
                      'is-active': selectedUserId === id,
                    })}
                    value={selectedUserId}
                    onClick={(event) => {
                      event.preventDefault();

                      setSelectedUserId(id);
                    }}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearQuery}
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
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {searchedProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
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
                            <i
                              data-cy="SortIcon"
                              className="fas
                              fa-sort-down"
                            />
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

                  {searchedProducts.map((product) => {
                    const { id, name, category, user } = product;

                    return (
                      <tr
                        key={id}
                        data-cy="Product"
                      >
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {id}
                        </td>

                        <td data-cy="ProductName">
                          {name}
                        </td>
                        <td data-cy="ProductCategory">
                          {`${category.icon} - ${category.title}`}
                        </td>

                        <td
                          data-cy="ProductUser"
                          className={
                            user.sex === 'm'
                              ? 'has-text-link'
                              : 'has-text-danger'
                          }
                        >
                          {user.name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
