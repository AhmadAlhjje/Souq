// "use client";

// import React from "react";
// import { Search } from "lucide-react";
// import useTheme from "@/hooks/useTheme";

// interface SearchBarProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   isRTL: boolean;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   searchQuery,
//   setSearchQuery,
//   isRTL,
// }) => {
//   const { isDark } = useTheme();

//   return (
//     <div className="flex-1 max-w-md mx-8">
//       <div className="relative w-full">
//         <Search
//           className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
//             isDark ? "text-gray-400" : "text-gray-400"
//           }`}
//         />
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="البحث في المنتجات، الطلبات..."
//           className={`w-full pl-12 pr-4 py-3 border-0 rounded-full transition-all focus:outline-none focus:ring-2 ${
//             isDark
//               ? "bg-gray-800 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:bg-gray-700"
//               : "bg-gray-50 text-gray-700 placeholder-gray-400 focus:ring-teal-500 focus:bg-white"
//           }`}
//         />
//       </div>
//     </div>
//   );
// };

// export default SearchBar;