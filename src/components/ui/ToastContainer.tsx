// // components/ui/ToastContainer.tsx
// "use client";
// import React from 'react';
// import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
// import { useToast, Toast, ToastType } from '../../contexts/ToastContext';

// const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
//   const { removeToast } = useToast();

//   const getToastStyles = (type: ToastType): string => {
//     switch (type) {
//       case 'success':
//         return 'bg-green-50 border-green-200 text-green-800';
//       case 'error':
//         return 'bg-red-50 border-red-200 text-red-800';
//       case 'warning':
//         return 'bg-yellow-50 border-yellow-200 text-yellow-800';
//       case 'info':
//         return 'bg-blue-50 border-blue-200 text-blue-800';
//       default:
//         return 'bg-gray-50 border-gray-200 text-gray-800';
//     }
//   };

//   const getToastIcon = (type: ToastType) => {
//     switch (type) {
//       case 'success':
//         return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'error':
//         return <AlertCircle className="w-5 h-5 text-red-500" />;
//       case 'warning':
//         return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
//       case 'info':
//         return <Info className="w-5 h-5 text-blue-500" />;
//       default:
//         return <Info className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   return (
//     <div 
//       className={`
//         flex items-center justify-between p-4 mb-3 border rounded-lg shadow-md
//         transform transition-all duration-300 ease-in-out
//         animate-slide-in-right max-w-md w-full
//         ${getToastStyles(toast.type)}
//       `}
//     >
//       <div className="flex items-center space-x-3 rtl:space-x-reverse">
//         {getToastIcon(toast.type)}
//         <p className="text-sm font-medium">{toast.message}</p>
//       </div>
      
//       <button
//         onClick={() => removeToast(toast.id)}
//         className="text-gray-400 hover:text-gray-600 transition-colors"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// const ToastContainer: React.FC = () => {
//   const { toasts } = useToast();

//   if (toasts.length === 0) return null;

//   return (
//     <div className="fixed top-4 right-4 z-50 space-y-2">
//       {toasts.map(toast => (
//         <ToastItem key={toast.id} toast={toast} />
//       ))}
//     </div>
//   );
// };

// export default ToastContainer;