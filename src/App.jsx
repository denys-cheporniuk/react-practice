import React from 'react';
import './App.scss';
import { ChangeEvent, useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';


const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.filter(cat => cat.id === product.categoryId);
  const user = usersFromServer.filter(us => us.id === category[0].ownerId);

  return {
    product,
    category,
    user,
  };
});



export const App = () => {

const [visibleProducts, setVisibleProducts] = useState(products);

const filteredByName = userId => {

  if(userId === null) {
    setVisibleProducts(products);
  } else {
    const filteredProducts = products.filter(pt => pt.user[0].id === userId);
    setVisibleProducts(filteredProducts);
  }
};

const handleInput = (event: ChangeEvent) => {



  const productName = event.target.value;


    const filteredProducts = products.filter(pt => pt.product.name.toLowerCase().includes(productName.toLowerCase()));

    if(filteredProducts.length > 0) {
      setVisibleProducts(filteredProducts);
    } else {
      setVisibleProducts([]);
    }

}

const resetAll = () => {
  filteredByName(null);
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
              onClick={() => filteredByName(null)}
            >
              All
            </a>

          {usersFromServer.map((user) => (
           <a
           data-cy="FilterUser"
           href="#/"
           onClick={() => filteredByName(user.id)}
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
                // value="qwe"
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
              className="button is-success mr-6 is-outlined"
            >
              All
            </a>




            /* <a
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
            </a> */}
          </div>

          <div className="panel-block">
            <a
              data-cy="ResetAllButton"
              href="#/"
              className="button is-link is-outlined is-fullwidth"
              onClick={() => resetAll()}
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


          {

          visibleProducts.length > 0 ?
          (visibleProducts.map((product) => (
            <tr data-cy="Product">
            <td
              className="has-text-weight-bold"
              data-cy="ProductId"
              key={product.id}>
              {product.product.id}
            </td>

            <td data-cy="ProductName">{product.product.name}</td>
            <td data-cy="ProductCategory">{`${product.category[0].icon} - ${product.category[0].title}`}</td>

            <td
              data-cy="ProductUser"
              className="has-text-link"
            >
              {product.user[0].name}
            </td>
          </tr>
          ))) : (
        <tr data-cy="Product">
            <td
            className="has-text-weight-bold"
            >
              {'No results'}
            </td>

          </tr>
          )

          }


          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};
