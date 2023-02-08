/* eslint-disable max-len */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getUserById = (userId) => {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser;
};

const categoriesWithUser = categoriesFromServer.map(category => ({
  ...category,
  owner: getUserById(category.ownerId),
}));

const getCategoryById = (categoryId) => {
  const foundCategory = categoriesWithUser
    .find(category => category.id === categoryId);

  return foundCategory;
};

const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId),
}));

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategory] = useState([]);

  const selectNewUser = (userName) => {
    setSelectedUser(userName);
  };

  let visibleProducts = products.filter(product => (
    selectedUser === 'All' || product.category.owner.name === selectedUser
  ));

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  visibleProducts = visibleProducts.filter((product) => {
    const preparedQuery = query.trim().toLowerCase();
    const preparedName = product.name.toLowerCase();

    return preparedName.includes(preparedQuery);
  });

  const resetQuery = () => {
    setQuery('');
  };

  const selectNewCategory = (categoryTitle) => {
    let selected = [];

    setSelectedCategory((prevSelectedCategory) => {
      if (prevSelectedCategory.includes(categoryTitle)) {
        const foundIndex = prevSelectedCategory.findIndex(category => category === categoryTitle);

        selected = [
          ...prevSelectedCategory.slice(0, foundIndex),
          ...prevSelectedCategory.slice(foundIndex + 1),
        ];
      } else {
        selected = [...prevSelectedCategory, categoryTitle];
      }

      return selected;
    });
  };

  const resetSelectedCategory = () => {
    setSelectedCategory([]);
  };

  visibleProducts = visibleProducts.filter(product => (
    selectedCategories.length === 0 || selectedCategories.includes(product.category.title)
  ));

  const resetAllFilters = () => {
    resetQuery();
    setSelectedUser('All');
    resetSelectedCategory();
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
                onClick={() => selectNewUser('All')}
                className={classNames(
                  { 'is-active': selectedUser === 'All' },
                )}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => selectNewUser(user.name)}
                  className={classNames(
                    { 'is-active': selectedUser === user.name },
                  )}
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
                  onChange={handleInputChange}
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
                      onClick={resetQuery}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames(
                  'button is-success mr-6',
                  { 'is-outlined': selectedCategories.length !== 0 },
                )}
                onClick={resetSelectedCategory}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={classNames(
                    'button mr-2 my-1',
                    { 'is-info': selectedCategories.includes(category.title) },
                  )}
                  href="#/"
                  onClick={() => selectNewCategory(category.title)}
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
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length > 0
            ? (
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
                      <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames(
                          { 'has-text-link': product.category.owner.sex === 'm' },
                          { 'has-text-danger': product.category.owner.sex === 'f' },
                        )}
                      >
                        {product.category.owner.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
            : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
};
