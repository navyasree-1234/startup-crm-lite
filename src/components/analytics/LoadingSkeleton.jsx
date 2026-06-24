import React from "react";

function SkeletonCard({ className }) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-colors duration-200 ${className}`}>
      {/* Header text line */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded-md w-1/3 animate-pulse" />
        <div className="h-3 bg-slate-100/60 dark:bg-gray-700/60 rounded-md w-1/2 animate-pulse" />
      </div>
      
      {/* Chart/Graph placeholder block */}
      <div className="flex-1 bg-slate-50/50 dark:bg-gray-700/30 rounded-xl my-6 flex items-center justify-center min-h-[160px] animate-pulse">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 dark:border-gray-650 animate-spin" />
      </div>

      {/* Footer text line */}
      <div className="h-3.5 bg-slate-100 dark:bg-gray-700 rounded-md w-1/4 animate-pulse mt-auto" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-slate-100 dark:bg-gray-700 rounded-md w-1/4 animate-pulse" />
          <div className="h-3.5 bg-slate-100/60 dark:bg-gray-700/60 rounded-md w-1/3 animate-pulse" />
        </div>
        <div className="h-10 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-700 rounded-xl w-48 animate-pulse shrink-0 transition-colors duration-200" />
      </div>

      {/* KPI Cards Row (6 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={`kpi-sk-${i}`} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[115px] transition-colors duration-200">
            <div className="flex justify-between items-start">
              <div className="h-3.5 bg-slate-100 dark:bg-gray-700 rounded-md w-2/3 animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="h-7 bg-slate-200 dark:bg-gray-700 rounded-md w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-100 dark:bg-gray-700 rounded-md w-1/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid Layouts mimicking the Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[380px]" />
        <SkeletonCard className="h-[380px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[380px]" />
        <SkeletonCard className="h-[380px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[380px]" />
        <SkeletonCard className="h-[380px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[340px]" />
        <SkeletonCard className="h-[340px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-[340px]" />
        <SkeletonCard className="h-[340px]" />
      </div>
    </div>
  );
}

export default React.memo(LoadingSkeleton);
