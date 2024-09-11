'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useBookmark } from '@/contexts/BookmarkContext';
import { BookmarkIcon, LoadingIcon } from '@constants/icons';

export default function BookmarkButton({ entityId, entityType, initialCount }) {
  const { data: session } = useSession();
  const { updateBookmarkState, fetchBookmarkStatus } = useBookmark();

  const [bookmarkCount, setBookmarkCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialStatus = async () => {
      if (session?.user?.id) {
        const status = await fetchBookmarkStatus(entityId, entityType);
        if (isMounted) {
          setBookmarked(status);
        }
      }
    };

    fetchInitialStatus();
    return () => {
      isMounted = false;
    };
  }, [session, entityId, entityType, fetchBookmarkStatus]);

  const toggleBookmark = async () => {
    if (!session) {
      console.log('User not authenticated');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/bookmark/${entityId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          entityType,
          userId: session.user.id,
          action: 'toggle'
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle bookmark');
      const data = await res.json();

      updateBookmarkState(entityId, entityType, data.isBookmarked);
      setBookmarked(data.isBookmarked);
      setBookmarkCount(data.bookmarkCount);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleBookmark} 
      disabled={loading}
      className="flex items-center p-2 rounded-full transition-colors duration-200 text-gray-800 hover:bg-gray-300"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {loading ? (
        <LoadingIcon className="w-5 h-5 animate-spin fill-gray-800" />
      ) : (
        <BookmarkIcon className={`w-5 h-5 ${bookmarked ? 'fill-gray-800' : ''}`}  />
      )}
      <span className="sr-only">{bookmarked ? 'Unbookmark' : 'Bookmark'}</span>
      <span className="text-sm text-gray-500" aria-live="polite">{bookmarkCount}</span>
    </button>
  );
}