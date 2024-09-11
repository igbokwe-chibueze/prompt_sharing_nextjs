'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const BookmarkContext = createContext();

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};

export function BookmarkProvider({ children }) {
  const [bookmarkedItems, setBookmarkedItems] = useState({});
  const { data: session } = useSession();

  const updateBookmarkState = useCallback((id, type, isBookmarked) => {
    setBookmarkedItems(prev => ({ ...prev, [`${type}_${id}`]: isBookmarked }));
  }, []);

  const isBookmarked = useCallback((id, type) => {
    return !!bookmarkedItems[`${type}_${id}`];
  }, [bookmarkedItems]);

  const fetchBookmarkStatus = useCallback(async (id, type) => {
    if (!session?.user?.id) return false;

    try {
      const res = await fetch(`/api/bookmark/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: type, userId: session.user.id, action: 'status' }),
      });

      if (!res.ok) throw new Error('Failed to fetch bookmark status');
      const { isBookmarked } = await res.json();

      updateBookmarkState(id, type, isBookmarked);
      return isBookmarked;
    } catch (error) {
      console.error('Error fetching bookmark status:', error);
      return false;
    }
  }, [session, updateBookmarkState]);

  const value = {
    updateBookmarkState,
    isBookmarked,
    fetchBookmarkStatus,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}