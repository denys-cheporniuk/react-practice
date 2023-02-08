import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(cat => cat.id === product.categoryId);
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return ({
    ...product,
    category,
    user,
  });
});

export const App = () => {
  const [visibleProducts, setVisibleProducts] = useState([...products]);
  const [activeUserId, serActiveUserId] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const [categories, setCategories] = useState([]);

  const filterByCategories = (id) => {
    setCategories(prevState => [...prevState, id]);
    setVisibleProducts([...products]
      .filter(product => product.category.id === categories
        .find(c => c.id === product.category.id)));
  };

  const searchByProductName = (value) => {
    let productsToFilter = [...products];

    if (activeUserId !== 0) {
      productsToFilter = productsToFilter.filter(product => product.user.id === activeUserId);
    }

    return productsToFilter.filter((product) => {
      const searchValue = value.toLowerCase();
      const productName = product.name.toLowerCase();

      return productName.includes(searchValue);
    });
  };

  const handlerInput = (value) => {
    setSearchParam(value);
    setVisibleProducts(searchByProductName(value));
  };

  const clearInput = () => {
    setSearchParam('');
    setVisibleProducts([...products]);
  };

  const filterByName = (personId) => {
    let productsToFilter = [...products];

    if (searchParam.length > 0) {
      productsToFilter = productsToFilter.filter((product) => {
        const searchValue = searchParam.toLowerCase();
        const productName = product.name.toLowerCase();

        return productName.includes(searchValue);
      });
    }

    serActiveUserId(personId);
    setVisibleProducts(productsToFilter.filter(product => product.user.id === personId));
  };

  const clearFilter = () => {
    serActiveUserId(0);
    setVisibleProducts([...products]);
  };

  const resetAllFilters = () => {
    clearInput();
    clearFilter();
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
                className={cn({
                  'is-active': activeUserId === 0,
                })}
                onClick={() => {
                  clearFilter();
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  className={cn({
                    'is-active': activeUserId === user.id,
                  })}
                  href="#/"
                  onClick={() => {
                    filterByName(user.id);
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
                  value={searchParam}
                  onChange={(event) => {
                    handlerInput(event.target.value);
                  }
                  }
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchParam.length > 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        clearInput();
                      }
                      }
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

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  onClick={() => {
                    filterByCategories(category.id);
                  }}
                >
                  {category.title}
                </a>
              ))}

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
                  resetAllFilters();
                }
                }
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
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

                      <td data-cy="ProductName">
                        {product.name}
                      </td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn(
                          'has-text-link',
                          {
                            'has-text-danger': product.user.sex === 'f',
                          },
                        )}
                      >
                        {product.user.name}
                      </td>
                    </tr>
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
