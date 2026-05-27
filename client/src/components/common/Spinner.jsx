const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md' }) => (
  <div className="flex items-center justify-center">
    <div
      className={`${sizeMap[size]} rounded-full border-slate-600 border-t-indigo-500 animate-spin`}
    />
  </div>
);

export default Spinner;
