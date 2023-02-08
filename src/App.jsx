import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// eslint-disable-next-line max-len
const preparePosts = (product, categories, users) => categories.map(category => ({
  ...category,
  product: product.filter(porducts => porducts.categoryId === category.id),
  user: users.find(user => user.id === category.ownerId) || null,
}));

const prepearedCategory = preparePosts(
  productsFromServer,
  categoriesFromServer,
  usersFromServer,
);

export const App = () => {
  const [query, setQuery] = useState('');
  // const [mainCategory, setMainCategory] = useState(prepearedCategory);

  const searchParam = prepearedCategory.filter((category) => {
    const searchParamLowerCase = query.toLocaleLowerCase();
    const titleLowerCase = category.title.toLowerCase();
    const userLowerCase = category.user.name.toLowerCase();

    if (titleLowerCase.includes(searchParamLowerCase)
      || userLowerCase.includes(searchParamLowerCase)) {
      return category;
    }

    return undefined;
  });

  // const handleReset = () => {
  //   const copy = [...prepearedCategory];

  //   setMainCategory(copy);
  // };

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
              >
                All
              </a>

              {prepearedCategory.map(category => (
                (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={category.id}
                  >
                    {category.user.name}
                  </a>
                )
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
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
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

              { prepearedCategory.map(category => (
                (
                  <a
                    data-cy="Category"
                    className="button mr-2 my-1 is-info"
                    href="#/"
                    key={category.id}
                  >
                    {category.title}
                  </a>
                )
              ))

              }
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
              { searchParam.map(category => (
                (
                  <tr data-cy="Product" key={category.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {category.id}
                    </td>

                    <td data-cy="ProductName">{category.product.name}</td>
                    <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className="has-text-link"
                    >
                      {category.user.name}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
