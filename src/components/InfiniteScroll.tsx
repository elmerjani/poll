import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200,
  children,
  className = '',
  loadingComponent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold]);

  const defaultLoadingComponent = (
    <div className="flex justify-center items-center py-8">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-400">Loading more polls...</span>
    </div>
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
      
      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-1" />
      
      {/* Loading indicator */}
      {loading && (loadingComponent || defaultLoadingComponent)}
      
      {/* End message */}
      {!hasMore && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
};