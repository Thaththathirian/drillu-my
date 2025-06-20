import React from 'react';

const DrillUPortalSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="w-36 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            
            {/* Navigation - Hidden on mobile */}
            <div className="hidden md:flex space-x-6">
              <div className="w-15 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-18 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-15 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Main Title */}
              <div className="space-y-3">
                <div className="w-full max-w-md lg:max-w-none h-14 bg-gray-200 rounded mx-auto lg:mx-0 animate-pulse"></div>
                <div className="w-4/5 max-w-sm lg:max-w-none h-14 bg-gray-200 rounded mx-auto lg:mx-0 animate-pulse"></div>
              </div>
              
              {/* Subtitle */}
              <div className="space-y-2">
                <div className="w-full max-w-lg h-5 bg-gray-200 rounded mx-auto lg:mx-0 animate-pulse"></div>
                <div className="w-4/5 max-w-md h-5 bg-gray-200 rounded mx-auto lg:mx-0 animate-pulse"></div>
              </div>
              
              {/* Statistics */}
              <div className="pt-6">
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:max-w-none">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <div className="w-20 h-9 bg-gray-200 rounded mx-auto animate-pulse"></div>
                      <div className="w-25 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Image - SVG Skeleton */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gray-200 rounded-2xl animate-pulse relative overflow-hidden">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="w-50 h-9 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-75 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Text Content */}
            <div className="space-y-6">
              {/* Paragraphs */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-11/12 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-9/10 h-4 bg-gray-200 rounded animate-pulse"></div>
                  {i === 3 && <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>}
                </div>
              ))}
              
              {/* Highlight Box */}
              <div className="bg-white p-6 rounded-xl border-l-4 border-gray-300">
                <div className="w-full h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="w-9/10 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Right Features */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-30 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-9/10 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal Cards Section Skeleton */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg border">
                {/* Card Header */}
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Card Description */}
                <div className="mb-6 space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-9/10 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Card Features List */}
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="w-4/5 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section Skeleton */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="w-62 h-9 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-87 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="w-4/5 h-5 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-9/10 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="w-50 h-9 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-75 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          {/* Testimonial Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              {/* Quote */}
              <div className="mb-6 space-y-3">
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-11/12 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-4/5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-30 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-gray-600 to-gray-700">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-6">
            <div className="w-100 h-10 bg-white bg-opacity-20 rounded mx-auto animate-pulse"></div>
            <div className="w-125 h-5 bg-white bg-opacity-20 rounded mx-auto animate-pulse"></div>
            <div className="w-75 h-5 bg-white bg-opacity-20 rounded mx-auto animate-pulse"></div>
            <div className="pt-4">
              <div className="w-35 h-12 bg-white bg-opacity-20 rounded-xl mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="py-6 bg-gradient-to-r from-green-100 to-teal-200">
        <div className="container mx-auto px-4 text-center">
          <div className="w-75 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
};

export default DrillUPortalSkeleton;