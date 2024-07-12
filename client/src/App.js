import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardUser from "./pages/User/Dashboard";
import DashboardAdmin from "./pages/Admin/Dashboard";
import Login from "./components/Login";
import User from "./pages/User";
import Permission from "./pages/Permission";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import EmployeeList from "./pages/Admin/Employee";
import AttendanceHistory from "./pages/Admin/Attendance";
import CreateAccountEmployee from "./pages/Admin/CreateAccount";
import Approval from "./pages/Admin/Approval";
import Announcement from "./pages/Admin/Announcement";
import DailyReport from "./pages/Admin/DailyReport";
import DetailDailyReport from "./pages/Admin/DetailDailyReport";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/build/modern/production.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";

const queryClient = new QueryClient();

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <div className="App">
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<DashboardUser />} />
              <Route path="/users" element={<User />} />
              <Route path="/users/add" element={<AddUser />} />
              <Route path="/users/edit/:id" element={<EditUser />} />
              <Route path="/permission" element={<Permission />} />

              {/* Route Admin */}
              <Route path="/dashboard-admin" element={<DashboardAdmin />} />
              <Route path="/employee-list" element={<EmployeeList />} />
              <Route
                path="/attendance-history"
                element={<AttendanceHistory />}
              />
              <Route
                path="/create-account-employee"
                element={<CreateAccountEmployee />}
              />
              <Route path="/announcement" element={<Announcement />} />
              <Route path="/approval" element={<Approval />} />
              <Route path="/daily-report" element={<DailyReport />} />
              <Route path={"/daily-report/:id"} element={<DetailDailyReport />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen />
          {showDevtools && (
            <React.Suspense fallback={null}>
              <ReactQueryDevtoolsProduction />
            </React.Suspense>
          )}
        </QueryClientProvider>
      </NextUIProvider>
    </div>
  );
}

export default App;
