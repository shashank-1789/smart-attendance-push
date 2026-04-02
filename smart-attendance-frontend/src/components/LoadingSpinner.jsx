const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
