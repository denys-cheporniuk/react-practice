import { React, useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUser(userId) {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

function getCategory(categoryId) {
  const foundCategory = categoriesFromServer
    .find(category => category.id === categoryId);

  return foundCategory || null;
}

const products = productsFromServer.map((product) => {
  const category = getCategory(product.categoryId); // find by product.categoryId
  const user = category ? getUser(category.ownerId) : null; // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [filteredByOwner, setFilteredByOwner] = useState(0);
  const [query, setQuery] = useState('');

  const filterByOwner = userId => setFilteredByOwner(userId);

  const filterProducts = () => {
    let filteredProducts = products;

    if (filteredByOwner) {
      filteredProducts = filteredProducts
        .filter(product => filteredByOwner === product.user.id);
    }

    if (query) {
      filteredProducts = filteredProducts.filter((product) => {
        const preparedQuery = query.toLowerCase().trim();
        const title = product.name.toLowerCase();

        return title.includes(preparedQuery);
      });
    }

    return filteredProducts;
  };

  const visibleProducts = filterProducts();

  const resetFilters = () => {
    setFilteredByOwner(0);
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
                onClick={() => filterByOwner(0)}
                className={classNames(
                  { 'is-active': !filteredByOwner },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => filterByOwner(user.id)}
                  className={classNames(
                    { 'is-active': user.id === filteredByOwner },
                  )}
                >
                  {user.name}
                </a>
              ))}

              {/* <a
                data-cy="FilterUser"
                href="#/"
                className="is-active"
              >
                User 2
              </a> */}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query
                  && (
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
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
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
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length
          && (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
          )}

          {!!visibleProducts.length
          && (
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
                    // className="has-text-link"
                    className={product.user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
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
