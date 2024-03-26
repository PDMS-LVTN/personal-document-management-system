import { useLocation, useNavigate } from "react-router";

export const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;
  const noteId = location.state?.noteId;

  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <img src="/no-access.jpg" alt="" className="w-80 h-80" />
      <h1 className="text-2xl font-semibold">No permission</h1>
      <p>Sorry, but you don't have permission to access this page</p>
      <p>
        To access, please contact the administrator or &nbsp;
        <span
          className="hover:font-bold hover:underline hover:text-violet-500 hover:cursor-pointer"
          onClick={() => {
            navigate("/login", {
              replace: true,
              state: { isShared: true, from, noteId },
            });
          }}
        >
          log in using alternative account
        </span>
      </p>
    </div>
  );
};
