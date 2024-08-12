import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMe } from "../features/authSlice"; // Adjust the import path as needed
import { hourglass } from "ldrs";
import Cookies from "js-cookie";

const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const { user, isLoadingUser, isError, isUserError } = useSelector(
    (state) => state.auth
  );
  const userRole = user?.role;
  const location = useLocation();

  hourglass.register();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && !user && isLoadingUser) {
      dispatch(getMe());
    }
  }, [user, isLoadingUser, isUserError]);

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    const accessToken = Cookies.get("accessToken");
    if (refreshToken && !user && isLoadingUser&& !accessToken ) {
      dispatch(getMe());
    }
  }, [user, isLoadingUser, isUserError]);

  if (!Cookies.get("accessToken") && !Cookies.get("refreshToken")) {
    return <Navigate to="/login" />;
  }

  if (isLoadingUser) {
    // Return a loading spinner or placeholder if needed
    return (
      <div className="flex justify-center my-80 items-center h-full">
        <l-hourglass
          size="40"
          bg-opacity="0.1"
          speed="1.75"
          color="black"
        ></l-hourglass>
      </div>
    );
  }

  if (!user && isError) {
    return <Navigate to="/login" />;
  }

  if (
    user &&
    !isLoadingUser &&
    !isUserError &&
    allowedRoles &&
    !allowedRoles.includes(userRole)
  ) {
    switch (userRole) {
      case "Admin":
        return <Navigate to="/dashboard-admin" state={{ from: location }} />;
      case "Superadmin":
        return (
          <Navigate to="/dashboard-superadmin" state={{ from: location }} />
        );
      case "User":
      default:
        return <Navigate to="/" state={{ from: location }} />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;


// import React, { useEffect } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getMe } from "../features/authSlice"; // Adjust the import path as needed
// import { hourglass } from "ldrs";

// const PrivateRoute = ({ allowedRoles }) => {
//   const dispatch = useDispatch();
//   const { user, isLoadingUser, isError, isUserError } = useSelector(
//     (state) => state.auth
//   );
//   const userRole = user?.role;
//   const location = useLocation();

//   hourglass.register();

//   useEffect(() => {
//     if (!user && isLoadingUser) {
//       dispatch(getMe());
//     }
//   }, [user, isLoadingUser, isUserError]);

//   console.log({ user, isLoadingUser, isUserError });

//   if (isLoadingUser) {
//     // Return a loading spinner or placeholder if needed
//     return (
//       <div className="flex justify-center my-80 items-center h-full">
//         <l-hourglass
//           size="40"
//           bg-opacity="0.1"
//           speed="1.75"
//           color="black"
//         ></l-hourglass>
//       </div>
//     );
//   }

//   if (!user && isError) {
//     return Navigate({
//       to: "/login",
//     });
//   }

//   if (
//     user &&
//     !isLoadingUser &&
//     !isUserError &&
//     allowedRoles &&
//     !allowedRoles.includes(userRole)
//   ) {
//     switch (userRole) {
//       case "Admin":
//         return <Navigate to="/dashboard-admin" state={{ from: location }} />;
//       case "Superadmin":
//         return (
//           <Navigate to="/dashboard-superadmin" state={{ from: location }} />
//         );
//       case "User":
//       default:
//         return <Navigate to="/" state={{ from: location }} />;
//     }
//   }

//   return <Outlet />;
// };

// export default PrivateRoute;
