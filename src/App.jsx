/* eslint-disable max-len */
import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './components/ProductTable/ProductTable';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(currentCategory => currentCategory.id === product.categoryId) || null;
  const user = usersFromServer
    .find(currentUser => currentUser.id === category.ownerId) || null;

  const currentProduct = {
    ...product,
    category,
    user,
  };

  return currentProduct;
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [query, setQuery] = useState('');
  // const [selectedCategories, setselectedCategories] = useState([]);

  const getVisibleProducts = () => {
    let filteredProducts = products;

    if (selectedUserId) {
      filteredProducts = filteredProducts.filter(product => product.user.id === selectedUserId);
    }

    if (query) {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query));
    }

    return filteredProducts;
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
                className={classNames({
                  'is-active': selectedUserId === '',
                })}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => {
                  setSelectedUserId('');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={classNames({
                    'is-active': selectedUserId === user.id,
                  })}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => {
                    setSelectedUserId(user.id);
                  }
                }
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

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query.length > 0 && (
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
                onClick={() => {
                  setQuery('');
                  setSelectedUserId('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <ProductTable products={getVisibleProducts()} />
          {getVisibleProducts().length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
