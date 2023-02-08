import React from 'react';

import cn from 'classnames';
import users from '../api/users';
import categories from '../api/categories';

export const Filters = ({
  query,
  setQuery,
  selectedUserId,
  setSelectedUserId,
  selectedCategoryIds,
  setSelectedCategoryIds,
}) => {
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

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            onClick={() => setSelectedUserId(0)}
            className={cn({
              'is-active': !selectedUserId,
            })}
          >
            All
          </a>

          {users.map(({ name, id }) => {
            const isSelected = selectedUserId === id;

            return (
              <a
                key={id}
                data-cy="FilterUser"
                href="#/"
                onClick={() => setSelectedUserId(id)}
                className={cn({
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
            className={cn(
              'button is-success mr-6',
              { 'is-outlined': hasSelectedCategories },
            )}
          >
            All
          </a>

          {categories.map(({ id, title }) => {
            const isSelected = selectedCategoryIds.includes(id);

            return (
              <a
                key={id}
                data-cy="Category"
                className={cn(
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
  );
};
