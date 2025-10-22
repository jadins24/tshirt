import { createSelector } from '@reduxjs/toolkit';

// Memoized selectors for better performance
export const selectAuth = (state) => state.auth;
export const selectCart = (state) => state.cart;
export const selectLoading = (state) => state.loading;
export const selectSearch = (state) => state.search;

// Derived selectors with memoization
export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth?.isAuthenticated || false
);

export const selectUser = createSelector(
  [selectAuth],
  (auth) => auth?.user || null
);

export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart?.items || []
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((count, item) => count + (item.quantity || 0), 0)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => {
    const price = parseFloat(item.price || 0);
    const quantity = parseInt(item.quantity || 0);
    return total + (price * quantity);
  }, 0)
);

export const selectIsLoading = createSelector(
  [selectLoading],
  (loading) => loading?.isLoading || false
);

export const selectSearchQuery = createSelector(
  [selectSearch],
  (search) => search?.query || ''
);

export const selectSearchResults = createSelector(
  [selectSearch],
  (search) => search?.results || []
);

// Combined selectors for complex data
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => {
    if (!user) return 'Guest';
    return user.userName || user.emailId || user.email || 'Guest';
  }
);

export const selectUserInitials = createSelector(
  [selectUserDisplayName],
  (name) => {
    if (!name || name === 'Guest') return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
);
