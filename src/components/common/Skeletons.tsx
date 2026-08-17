import React from 'react';

export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200/80 dark:bg-gray-800/80 sepia:bg-[#E4DAC8] ${className}`}
      {...props}
    />
  );
}

export function ArticleCardSkeleton({ className = '' }: { className?: string; key?: React.Key }) {
  return (
    <div 
      className={`flex-shrink-0 relative rounded-2xl overflow-hidden bg-gray-900 ${className || 'w-64 aspect-[4/5]'}`}
    >
      {/* Full Background Image Shimmer */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-none" />

      {/* Top Left Badge Shimmer */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <Skeleton className="h-4 w-12 bg-white/20 dark:bg-gray-700/50 backdrop-blur-xs rounded" />
      </div>

      {/* Bottom Gradient Area with Text Line Shimmers */}
      <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-black via-black/85 to-transparent p-3.5 sm:p-4 flex flex-col justify-end gap-2 z-10">
        <Skeleton className="h-3.5 w-[92%] bg-white/30 rounded" />
        <Skeleton className="h-3.5 w-[65%] bg-white/30 rounded" />
      </div>
    </div>
  );
}

export function TrendingRowSkeleton() {
  return (
    <section className="py-8 relative max-w-[1400px] mx-auto px-4">
      {/* Title Shimmer */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>

      {/* Cards Carousel Shimmer */}
      <div className="flex gap-4 overflow-hidden justify-center sm:justify-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <ArticleCardSkeleton key={i} className="w-52 aspect-[4/5] shrink-0" />
        ))}
      </div>
    </section>
  );
}

export function ForYouRowSkeleton() {
  return (
    <section className="py-10 relative bg-gray-50/70 dark:bg-white/5 sepia:bg-black/5 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Title Shimmer */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-9 w-48 rounded-xl" />
        </div>

        {/* Cards Row Shimmer */}
        <div className="flex gap-4 overflow-hidden justify-center sm:justify-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleCardSkeleton key={i} className="w-52 aspect-[4/5] shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function VerticalFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      {/* Section Title Shimmer */}
      <div className="flex justify-center mb-10">
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>

      {/* Vertical Feed Cards */}
      <div className="flex flex-col items-center gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <ArticleCardSkeleton key={i} className="w-full max-w-[340px] aspect-[4/5]" />
        ))}
      </div>
    </section>
  );
}

export function ArticlePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-14 space-y-8 animate-pulse">
      {/* Category & Read time breadcrumb */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>

      {/* Title Lines */}
      <div className="space-y-3">
        <Skeleton className="h-10 sm:h-12 w-[95%] rounded-xl" />
        <Skeleton className="h-10 sm:h-12 w-[65%] rounded-xl" />
      </div>

      {/* Author Bar */}
      <div className="flex items-center gap-4 py-4 border-y border-gray-100 dark:border-gray-800 sepia:border-[#E0D4C0]">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>

      {/* Main Hero Image */}
      <Skeleton className="w-full aspect-[4/5] max-h-[600px] rounded-3xl" />

      {/* Content Body Paragraphs */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-[96%] rounded" />
        <Skeleton className="h-4 w-[92%] rounded" />
        <Skeleton className="h-4 w-[98%] rounded" />
        <Skeleton className="h-4 w-[85%] rounded" />
      </div>

      {/* Read Also Box Skeleton */}
      <div className="p-4 bg-gray-50 dark:bg-white/5 sepia:bg-black/5 rounded-xl flex items-center gap-3">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 flex-1 rounded" />
      </div>

      {/* Heading & More Paragraphs */}
      <div className="space-y-4 pt-6">
        <Skeleton className="h-8 w-64 rounded-xl mb-4" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-[94%] rounded" />
        <Skeleton className="h-4 w-[90%] rounded" />
      </div>

      {/* Related Stories Header & Cards */}
      <div className="pt-12 border-t border-gray-100 dark:border-gray-800 sepia:border-[#E0D4C0] space-y-6">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={i} className="w-full aspect-[4/5]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-14 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-12 w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
      </div>

      <div className="h-px w-full bg-gray-100 dark:bg-gray-800 sepia:bg-[#E0D4C0] my-8" />

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} className="w-full aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}

export function AuthorPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 space-y-10 animate-pulse">
      {/* Author Card */}
      <div className="flex flex-col md:flex-row gap-8 items-start bg-gray-50/50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
        <Skeleton className="w-32 h-32 rounded-full shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-lg rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} className="w-full aspect-[4/5]" />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
