// app/cart/loading.tsx
export default function CartLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 mt-24" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header Skeleton */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="w-24 h-8 bg-white/20 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
              <div className="w-12 h-8 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Table Skeleton */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Table Rows */}
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className={`p-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                        <div className="flex-1 mx-4">
                          <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                          <div className="w-1/2 h-3 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-20 h-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-teal-100">
                  <div className="text-center mb-4">
                    <div className="w-32 h-6 bg-gray-300 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="w-12 h-0.5 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full h-12 bg-gray-300 rounded-xl animate-pulse mt-6"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}