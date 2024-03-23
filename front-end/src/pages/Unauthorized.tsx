export const Unauthorized = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <img src="/no-access.jpg" alt="" className="w-80 h-80" />
      <h1 className="text-2xl font-semibold">No permission</h1>
      <p>Sorry, but you don't have permission to access this page</p>
      <p>To access, please contact the administrator</p>
    </div>
  );
};
