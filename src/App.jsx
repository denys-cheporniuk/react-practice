import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const categories = categoriesFromServer.map((category) => {
  const newCategory = {
    ...category,
    user: findUserById(category.ownerId),
  };

  return newCategory;
});

const products = productsFromServer.map((product) => {
  const newProduct = {
    ...product,
    category: findCategoryById(product.categoryId),
  };

  return newProduct;
});

function findCategoryById(categoryId) {
  const foundCategory = categories.find(category => (
    category.id === categoryId));

  return foundCategory || null;
}

function findUserById(ownerId) {
  const foundUser = usersFromServer.find(user => ownerId === user.id);

  return foundUser || null;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [filteredProducts, setFilterProducts] = useState(products);
  const [query, setQuery] = useState('');

  const getProductByUserName = (userName) => {
    const filtered = products.filter(product => (
      product.category.user.name === userName
    ));

    setFilterProducts(filtered);
    setSelectedUser(userName);
  };

  const getFilteredProduts = (productName, filterProducts, user) => {
    const nameLowerCase = productName.toLowerCase();

    const filterByProductName = filterProducts.filter((product) => {
      if (!selectedUser) {
        return product.name.toLowerCase().includes(nameLowerCase);
      }

      const userName = product.category.user.name;

      return product.name.toLowerCase()
        .includes(nameLowerCase) && user === userName;
    });

    setFilterProducts(filterByProductName);
  };

  const resetFilter = () => {
    setSelectedUser('');
    setFilterProducts(products);
  };

  const clearSearch = () => {
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
                className={classNames(
                  { 'is-active': !selectedUser },
                )}
                href="#/"
                onClick={() => resetFilter()}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  className={classNames(
                    { 'is-active': selectedUser === user.name },
                  )}
                  href="#/"
                  onClick={() => getProductByUserName(user.name)}
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                    getFilteredProduts(query, filteredProducts, selectedUser);
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
                      onClick={() => clearSearch()}
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
                onClick={() => resetFilter()}
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
            {filteredProducts.length !== 0 && (
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
            )}

            <tbody>
              {filteredProducts.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={classNames(
                      { 'has-text-link': product.category.user.sex === 'm' },
                      { 'has-text-danger': product.category.user.sex === 'f' },
                    )}
                  >
                    {product.category.user.name}
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
