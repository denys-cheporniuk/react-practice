import React, { useState } from 'react';
import { Product } from './components/Product';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
// eslint-disable-next-line import/order
import classNames from 'classnames';

const products = productsFromServer.map((product) => {
  // eslint-disable-next-line max-len
  const categories = categoriesFromServer.find(category => category.id === product.categoryId); // find by product.categoryId
  const users = usersFromServer.find(user => user.id === categories.ownerId); // find by category.ownerId

  return {
    ...product,
    categories,
    users,
  };
});

export const App = () => {
  const [getUser, setUser] = useState(0);
  const [getValue, setValue] = useState('');
  let preparedProducts = [...products];

  const prepareProducts = () => {
    if (getUser !== 0) {
      // eslint-disable-next-line max-len
      preparedProducts = preparedProducts.filter(product => product.user.id === getUser);
    }

    if (getValue) {
      const lower = getValue.toLowerCase().trim();

      preparedProducts = preparedProducts.filter((product) => {
        const lowerProduct = product.name.toLowerCase();

        return lowerProduct.includes(lower);
      });
    }

    return preparedProducts;
  };

  const filterProducts = prepareProducts();

  const resetFilters = () => {
    setUser(0);
    setValue('');
  };

  const handleOnChange = (event) => {
    setValue(event.target.value);
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
                className={classNames({
                  'is-active': getUser === 0,
                })}
                onClick={() => setUser(0)}
              >
                All
              </a>
            </p>

            {usersFromServer.map(user => (
              <a
                data-cy="FilterUser"
                href="#/"
                key={user.id}
                className={classNames({
                  'is-active': getUser === user.id,
                })}
                onClick={() => setUser(user.id)}
              >
                {user.name}
              </a>
            ))}

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={getValue}
                  onChange={handleOnChange}
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
                    onClick={() => setValue('')}
                  />
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
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filterProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              />
            )
        }
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
            {filterProducts.map(product => (
              <Product key={product.id} product={product} />
            ))}
            ;
          </tbody>
        </div>
      </div>
    </div>
  );
};
