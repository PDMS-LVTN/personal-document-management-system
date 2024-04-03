export const ErrorBoundary = () => {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <img src="/not-found.jpg" alt="" className="w-80 h-80" />
      <h1 className="text-2xl font-semibold">Error</h1>
      <p>Oops! Some error happened</p>
    </div>
  );
};
