import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import { ProductTable } from './components/ProductTable/ProductTable';

const getProductsWithCategories = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(() => category.id === product.categoryId) || null;
  const user = usersFromServer.find(() => user.id === category.ownerId) || null;

  return { ...product, category, user } || null;
});

// const visibleProducts = getProductsWithCategories.filter(product => {
//   const name = product.name.toLowerCase();

// });

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [products] = useState(getProductsWithCategories);

  const [query, setQuery] = useState('');
  const preparedQuery = query.toLowerCase().trim();

  const visibleProducts = products.filter((product) => {
    const name = product.name.toLowerCase();

    return name.includes(preparedQuery);
  });

  // const [isReversed, setIsReversed] = useState(false);
  // const [sortType, setSortType] = useState(SortType.NONE);

  // const reverseTable = () => {
  //   setIsReversed(current => !current);
  // };

  // const resetTable = () => {
  //   setSelectedUser(0);
  //   setIsReversed(false);
  // };

  // const filterByUser = () => {
  //   visibleProducts.filter(category => category.ownerId === user.id);
  // };

  const isResetButtonVisible = query.length > 0;

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
                  'is-active': selectedUser,
                })}
                onClick={setSelectedUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={(event) => {
                    setSelectedUser(user.id);
                  }}
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
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
                  onChange={event => setQuery(event.target.value)}
                />

                {isResetButtonVisible && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                    />
                  </span>
                )}

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
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
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {/* <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
        </div> */}

        <ProductTable products={visibleProducts} />
      </div>
    </div>
  );
};
