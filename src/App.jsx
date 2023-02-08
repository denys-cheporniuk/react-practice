import React, { useState, useCallback, useEffect } from 'react';
import './App.scss';

import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function findCategoryById(id) {
  const foundCategory = categoriesFromServer.find(cat => cat.id === id);

  return foundCategory || null;
}

function findUserById(id) {
  const foundUser = usersFromServer.find(user => user.id === id);

  return foundUser || null;
}

const products = productsFromServer.map((product) => {
  const category = findCategoryById(product.categoryId);
  const user = findUserById(category?.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [visibleProduct, setVisibleProduct] = useState(products);
  const [userId, setUserId] = useState(0);
  const [productName, setProductName] = useState('');
  // const [query, setQuery] = useState('');
  // const lowerCaseQuery = query.toLowerCase().trim();

  // const filterProduct = visibleProduct.filter(
  //   prod => prod.title.toLowerCase().includes(lowerCaseQuery)
  //   || prod.description.toLowerCase().includes(lowerCaseQuery),
  // );

  const handleSelectUser = useCallback((id) => {
    setUserId(id);

    if (id === 0) {
      setVisibleProduct(products);
    } else {
      setVisibleProduct(products.filter(product => product.user?.id === id));
    }
  }, []);

  const handleName = useCallback((event) => {
    setProductName(event.target.value);
  }, []);

  useEffect(() => {
    let productsCopy = [...products];

    if (userId !== 0) {
      productsCopy = productsCopy.filter(
        product => product.name.toLowerCase().includes(
          productName.toLowerCase(),
        ),
      );
    }

    setVisibleProduct(productsCopy);
  }, [userId, productName]);

  const resetAllFilters = useCallback(() => {
    setProductName('');
    setUserId(0);
  }, []);

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
                onClick={() => handleSelectUser(0)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setUserId(user.id)}
                  className={classNames({ 'is-active': user.id === userId })}
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
                  value={productName}
                  onChange={handleName}
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
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

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
              {visibleProduct.map(product => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={classNames({
                      'has-text-link': product.user.sex === 'm',
                      'has-text-danger': product.user.sex === 'f',
                    })}
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
