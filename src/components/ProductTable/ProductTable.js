import React from 'react';
import { Product } from '../Product/Product';

export const ProductTable = ({ products }) => (
  <table
    data-cy="ProductTable"
     className="table is-striped is-narrow is-fullwidth"
  >
    <thead>
      <tr>
       <th>
          <span className="is-flex is-flex-wrap-nowrap">
              Id
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
      {products.map(product => (
        <tr data-cy="Product" key={product.id}>
          <Product product={product} />
         </tr>
      ))}
    </tbody>
  </table>
);
