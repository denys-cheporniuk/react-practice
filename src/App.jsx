import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './Components/ProductTable';
import { Filters } from './Components/Filters';

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

  const loweredQuery = query.toLowerCase();

  const filteredProducts = products.filter(({ name, user, category }) => {
    const passesSearch = `${name}${user.name}${category.title}`
      .toLowerCase()
      .includes(loweredQuery);

    const belongsToUser = selectedUserId
      ? selectedUserId === user.id
      : true;

    const belongsToCategory = !selectedCategoryIds.length
      ? true
      : selectedCategoryIds.includes(category.id);

    return passesSearch && belongsToUser && belongsToCategory;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <Filters
          query={query}
          setQuery={setQuery}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
        />

        <div className="box table-container">
          {!filteredProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <ProductTable
              products={filteredProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};
