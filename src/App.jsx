import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const categories = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );
  const users = usersFromServer.find(user => user.id === categories.ownerId);

  return {
    ...product,
    categories,
    users,
  };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const preparedProducts = (product) => {
    let copy = [...product];

    if (selectedCategories.length > 0) {
      copy = copy.filter(
        productCopy => (selectedCategories.includes(
          productCopy.categories.title,
        )),
      );
    }

    if (selectedUser) {
      copy = copy.filter(({ users }) => users.id === selectedUser);
    }

    if (query) {
      copy = copy.filter(({ name }) => {
        const productName = name.toLowerCase();
        const lowerQuery = query.toLowerCase().trim();

        return productName.includes(lowerQuery);
      });
    }

    return copy;
  };

  const handleQueryInput = (event) => {
    setQuery(event.target.value);
  };

  const clearQuery = () => {
    setQuery('');
  };

  const clearSelected = () => {
    setSelectedUser(0);
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const clearAllFilters = () => {
    clearCategories();
    clearQuery();
    clearSelected();
  };

  const filteredProducts = preparedProducts(products);

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
                className={classNames({
                  'is-active': !selectedUser,
                })}
                onClick={clearSelected}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
                  value={selectedUser}
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
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
                  onChange={handleQueryInput}
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
                className={classNames(
                  'button is-success mr-6',
                  {
                    'is-outlined': selectedCategories.length > 0,
                  },
                )}
                onClick={clearCategories}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  key={category.id}
                  className={classNames(
                    'button mr-2 my-1',
                    {
                      'is-info': selectedCategories.includes(category.title),
                    },
                  )}
                  href="#/"
                  onClick={() => setSelectedCategories(
                    categories => ([...categories, category.title]),
                  )}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 && (
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
              {filteredProducts.map(product => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.categories.icon}
                    {' - '}
                    {product.categories.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={classNames(
                      'has-text-link',
                      {
                        'has-text-danger': product.users.sex === 'f',
                      },
                    )}
                  >
                    {product.users.name}
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
