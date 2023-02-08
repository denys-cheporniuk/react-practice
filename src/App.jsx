import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategoryById = id => categoriesFromServer.find(category => (
  category.id === id
) || null);

const getUserById = id => usersFromServer.find(user => (
  user.id === id
) || null);

const products = productsFromServer.map((product) => {
  const category = getCategoryById(product.categoryId);
  const user = getUserById(category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const lowerQuery = query.toLowerCase();

  const hasSelectedCategories = !!selectedCategoryIds.length;

  const handleInput = (event) => {
    setQuery(event.target.value);
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedUserId(0);
    setSelectedCategoryIds([]);
  };

  const handleSelectCategory = (categoryId, isSelected) => {
    if (isSelected) {
      setSelectedCategoryIds(prev => (
        prev.filter(id => categoryId !== id)
      ));
    } else {
      setSelectedCategoryIds(prev => [...prev, categoryId]);
    }
  };

  const handleShowAllCategories = () => setSelectedCategoryIds([]);

  const filteredProducts = products.filter((product) => {
    let passesSearch = true;
    let isRightUser = true;
    let isRightCategory = true;

    if (query) {
      const searchString = product.name
        + product.user.name + product.category.title;

      passesSearch = searchString.toLowerCase().includes(lowerQuery);
    }

    if (selectedUserId) {
      isRightUser = product.user.id === selectedUserId;
    }

    if (selectedCategoryIds.length) {
      isRightCategory = selectedCategoryIds.includes(product.category.id);
    }

    return passesSearch && isRightUser && isRightCategory;
  });

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
                onClick={() => setSelectedUserId(0)}
                className={classNames({
                  'is-active': !selectedUserId,
                })}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => {
                const isSelected = selectedUserId === id;

                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => setSelectedUserId(id)}
                    className={classNames({
                      'is-active': isSelected,
                    })}
                  >
                    {name}
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
                  onChange={handleInput}
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
                onClick={handleShowAllCategories}
                className={classNames(
                  'button is-success mr-6',
                  { 'is-danger': hasSelectedCategories },
                )}
              >
                All
              </a>

              {categoriesFromServer.map(({ id, title }) => {
                const isSelected = selectedCategoryIds.includes(id);

                return (
                  <a
                    data-cy="Category"
                    className={classNames(
                      'button mr-2 my-1',
                      { 'is-info': isSelected },
                    )}
                    href="#/"
                    onClick={() => handleSelectCategory(id, isSelected)}
                  >
                    {title}
                  </a>
                );
              })}
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
          {!filteredProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort"
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort"
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort"
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a
                        href="#/"
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className="fas fa-sort"
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const { id, name } = product;
                  const { title, icon } = product.category;
                  const fullCategoryName = `${icon} - ${title}`;
                  const { name: ownerName, sex: userSex } = product.user;
                  const isOwnerMale = userSex === 'm';

                  return (
                    <tr data-cy="Product" key={id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">{fullCategoryName}</td>

                      <td
                        data-cy="ProductUser"
                        className={classNames({
                          'has-text-link': isOwnerMale,
                          'has-text-danger': !isOwnerMale,
                        })}
                      >
                        {ownerName}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};
