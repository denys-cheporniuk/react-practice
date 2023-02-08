import React from 'react';
import './App.scss';

import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { useState } from 'react';

const products = productsFromServer.map((product) => {

  const category = categoriesFromServer.find(category => category.id === product.categoryId); // find by product.categoryId
  const user = usersFromServer.find(user => user.id === category.ownerId); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

export function getPrepareProducts(productsCard, filterBy, searchBy) {
  let isVisibleProducts = [...productsCard];

  if (filterBy !== 0) {
    isVisibleProducts = isVisibleProducts.filter(product => product.user.id === filterBy);
  }

  if (searchBy.length > 0) {
    isVisibleProducts = isVisibleProducts.filter(product => product.name.toLowerCase().includes(searchBy.toLowerCase()));
  }

  return isVisibleProducts;
}

export const App = () => {
  const [filterBy, setFilterBy] = useState(0);
  const [query, setQuery] = useState('');

  const prepareProducts = getPrepareProducts(products, filterBy, query);

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
                classNames={classNames({
                  'is-active': filterBy === 0,
                })}
                value={filterBy}
                onClick={(event) => {
                  event.preventDefault();

                  setFilterBy(0);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  classNames={classNames({
                    'is-active': filterBy === user.id,
                  })}
                  key={user.id}
                  value={filterBy}
                  onClick={(event) => {
                    event.preventDefault();

                    setFilterBy(user.id);
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
                  onChange={(event) => (
                    setQuery(event.target.value)
                  )}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => (
                        setQuery('')
                      )}
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
                onClick={() => {
                  setQuery('');
                  setFilterBy(0);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
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

            {prepareProducts.length > 0 ? (
              <tbody>
                {prepareProducts.map(product => (
                  <tr
                    data-cy="Product"
                    key={product.id}
                  >
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon}
                      -
                      {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        "has-text-link": product.user.sex === 'm',
                        "has-text-danger":  product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
             </tbody>
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}


          </table>
        </div>
      </div>
    </div>
  )
};
