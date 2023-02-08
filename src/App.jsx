import React, { useState } from 'react';
import cn from 'classnames';
import { Product } from './components/Product/Product';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(item => item.id === product.categoryId);
  const user = usersFromServer
    .find(person => person.id === category.ownerId);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortType, setSortType] = useState(0);

  const handeSortProducts = (byName) => {
    if (sortBy === byName && sortType < 2) {
      setSortType(prevSortType => prevSortType + 1);
    } else {
      setSortType(0);
    }

    setSortBy(byName);
  };

  const handleSelectCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      const filteredSelectedCategories = selectedCategories
        .filter(id => id !== categoryId);

      setSelectedCategories(filteredSelectedCategories);

      return;
    }

    setSelectedCategories(prevSelectedCategories => (
      [...prevSelectedCategories, categoryId]
    ));
  };

  const isCateogrySelected = caregoryId => (
    selectedCategories.includes(caregoryId)
  );

  const resetFilters = () => {
    setSelectedUser(0);
    setSearchValue('');
  };

  const prepareProducts = () => {
    let preparedProducts = [...products];

    if (selectedUser !== 0) {
      preparedProducts = preparedProducts
        .filter(product => product.user.id === selectedUser);
    }

    if (searchValue) {
      const lowerSearch = searchValue.toLowerCase().trim();

      preparedProducts = preparedProducts
        .filter((product) => {
          const lowerProduct = product.name.toLowerCase();

          return lowerProduct.includes(lowerSearch);
        });
    }

    if (selectedCategories.length) {
      preparedProducts = preparedProducts.filter(product => (
        selectedCategories.some(categoryId => categoryId === product.categoryId)
      ));
    }

    preparedProducts.sort((a, b) => {
      switch (sortType) {
        case 1:
          if (sortBy === 'id') {
            return a[sortBy] - b[sortBy];
          }

          if (sortBy === 'category') {
            return a[sortBy].title.localeCompare(b[sortBy].title);
          }

          if (sortBy === 'user') {
            return a[sortBy].name.localeCompare(b[sortBy].name);
          }

          return a[sortBy].localeCompare(b[sortBy]);
        case 2:
          if (sortBy === 'id') {
            return b[sortBy] - a[sortBy];
          }

          if (sortBy === 'category') {
            return b[sortBy].title.localeCompare(a[sortBy].title);
          }

          if (sortBy === 'user') {
            return b[sortBy].name.localeCompare(a[sortBy].name);
          }

          return b[sortBy].localeCompare(a[sortBy]);
        default:
          return 0;
      }
    });

    return preparedProducts;
  };

  const filteredProducts = prepareProducts();

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
                className={cn({
                  'is-active': selectedUser === 0,
                })}
                href="#/"
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  className={cn({
                    'is-active': selectedUser === user.id,
                  })}
                  data-cy="FilterUser"
                  href="#/"
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
                  value={searchValue}
                  onChange={event => setSearchValue(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {searchValue && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchValue('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn(
                  'button is-success mr-6',
                  {
                    'is-outlined': !selectedCategories.length,
                  },
                )}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn(
                    'button mr-2 my-1',
                    {
                      'is-info': isCateogrySelected(category.id),
                    },
                  )}
                  href="#/"
                  onClick={() => handleSelectCategory(category.id)}
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
          {!filteredProducts.length
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
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
                          onClick={() => handeSortProducts('id')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn(
                                'fas',
                                {
                                  'fa-sort': (sortBy !== 'id'
                                    || sortType === 0),
                                  'fa-sort-up': sortBy === 'id'
                                    && sortType === 1,
                                  'fa-sort-down': sortBy === 'id'
                                    && sortType === 2,
                                },
                              )}
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
                          onClick={() => handeSortProducts('name')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn(
                                'fas',
                                {
                                  'fa-sort': (sortBy !== 'name'
                                    || sortType === 0),
                                  'fa-sort-up': sortBy === 'name'
                                    && sortType === 1,
                                  'fa-sort-down': sortBy === 'name'
                                    && sortType === 2,
                                },
                              )}
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
                          onClick={() => handeSortProducts('category')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn(
                                'fas',
                                {
                                  'fa-sort': (sortBy !== 'category'
                                    || sortType === 0),
                                  'fa-sort-up': sortBy === 'category'
                                    && sortType === 1,
                                  'fa-sort-down': sortBy === 'category'
                                    && sortType === 2,
                                },
                              )}
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
                          onClick={() => handeSortProducts('user')}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={cn(
                                'fas',
                                {
                                  'fa-sort': (sortBy !== 'user'
                                    || sortType === 0),
                                  'fa-sort-up': sortBy === 'user'
                                    && sortType === 1,
                                  'fa-sort-down': sortBy === 'user'
                                    && sortType === 2,
                                },
                              )}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(product => (
                    <Product key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
