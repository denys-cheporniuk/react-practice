import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategory(categoryId) {
  const foundCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return foundCategory || null;
}

function getUser(userId) {
  const foundUser = usersFromServer.find(
    user => userId === user.id,
  );

  return foundUser || null;
}

const products = productsFromServer.map((product) => {
  const category = getCategory(product.categoryId);
  const user = getUser(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [query, setQuery] = useState('');
  const adaptedQuery = query.toLocaleLowerCase().trim();

  let visibleProducts = products;

  if (selectedUser.length !== 0) {
    visibleProducts = products.filter(product => (
      selectedUser.id === product.user.id
    ));
  }

  if (query !== '') {
    visibleProducts = products.filter(product => (
      product.name.toLocaleLowerCase().includes(adaptedQuery)
    ));
  }

  const resetAllFilters = () => {
    setSelectedUser([]);
    setQuery('');
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
                onClick={() => {
                  setSelectedUser([]);
                }}
                className={cn({
                  'is-active': selectedUser.length === 0,
                })}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const isUserSelected = Boolean(user.id === selectedUser.id);

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                    className={cn({
                      'is-active': isUserSelected,
                    })}
                  >
                    {user.name}
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
                      onClick={() => setQuery('')}
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
                onClick={() => setSelectedCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const isCategorySelected = Boolean(
                  category.id === selectedCategory.id,
                );

                return (
                  <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1', {
                      'is-info': isCategorySelected,
                    })}
                    href="#/"
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAllFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
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
                              className="fas fa-sort-down"
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
                  {visibleProducts.map(product => (
                    <tr
                      data-cy="Product"
                      key={product.id}
                    >
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
                        className="has-text-link"
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            }

        </div>
      </div>
    </div>
  );
};
