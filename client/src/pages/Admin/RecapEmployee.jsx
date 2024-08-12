import React, { useState } from "react";
import Layout from "../Layout";
import RecapEmployeeTable from "../../components/Admin/RecapEmployeeTable";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { IoMdSearch } from "react-icons/io";
import { recapAttendanceFn } from "../../api/attendance/attendance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function RecapEmployee() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showDateRange, setShowDateRange] = useState(false);

  const fetchAttendance = async () => {
    const { startDate, endDate } = dateRange[0];
    return recapAttendanceFn({
      full_name: search,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const {
    data: dataRecapAttendance,
    refetch: refetchRecapAttendance,
    isLoading: loadingRecapAttendance,
  } = useQuery({
    queryKey: ["RecapAttendance", search, dateRange],
    queryFn: fetchAttendance,
    enabled: true, // Disable automatic fetching
  });

  const toggleDateRangePicker = () => {
    setShowDateRange(!showDateRange);
  };

  const handleSearch = () => {
    refetchRecapAttendance();
  };

  const handleClear = () => {
    setSearch("");
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    refetchRecapAttendance(); // Clear and fetch again
  };

  return (
    <Layout>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start w-1/2">
          <div>
            <div className="flex flex-row gap-5">
              <button
                onClick={toggleDateRangePicker}
                className="btn bg-black text-white shadow-xl my-10 hover:bg-white hover:text-black"
              >
                {showDateRange ? "Cancel" : "Select Range"}
              </button>
              <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10 h-12 rounded-lg bg-white border border-black hover:border-black focus:border-black border-solid border-2 shadow-xl">
                <IoMdSearch fontSize="1.125 rem" color="#000000" />
                <input
                  type="text"
                  className="flex h-10 pe-4 pb-1 w-full rounded-lg outline-none text-sm"
                  placeholder="Search Employee"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            {showDateRange && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row gap-5 my-10">
          <div>
            <button
              onClick={handleSearch}
              className="btn bg-gray-700 text-white shadow-xl hover:bg-white hover:text-black"
            >
              Search
            </button>
          </div>
          <div>
            <button
              onClick={handleClear}
              className="btn bg-white text-black shadow-xl hover:bg-white hover:text-black"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <RecapEmployeeTable
        data={dataRecapAttendance}
        loading={loadingRecapAttendance}
      />
    </Layout>
  );
}

// import React, { useState, useMemo } from "react";
// import Layout from "../Layout";
// import RecapEmployeeTable from "../../components/Admin/RecapEmployeeTable";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css"; // theme css file
// import { DateRange } from "react-date-range";
// import { IoMdSearch } from "react-icons/io";
// import { recapAllAttendanceFn } from "../../api/attendance/attendance";
// import { useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// export default function RecapEmployee() {
//   const [search, setSearch] = useState("");
//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: 'selection'
//     }
//   ]);
//   const [showDateRange, setShowDateRange] = useState(false);

//   const { data: dataRecapAttendance, refetch: refetchRecapAttendance, isLoading: loadingRecapAttendance } = useQuery({
//     queryKey: ["RecapAttendance"],
//     queryFn: recapAllAttendanceFn,
//     enabled: true, // Disable automatic fetching
//   });

//   const filteredData = useMemo(() => {
//     if (!dataRecapAttendance) return [];
//     return dataRecapAttendance.filter(employee =>
//       employee?.full_name?.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [dataRecapAttendance, search]);

//   const toggleDateRangePicker = () => {
//     setShowDateRange(!showDateRange);
//   };

//   const handleSearch = () => {
//     refetchRecapAttendance();
//   };

//   return (
//     <Layout>
//       <div className="flex flex-row justify-between">
//         <div className="flex flex-col items-start w-1/2">
//           <div>
//             <div className="flex flex-row gap-5">
//               <button
//                 onClick={toggleDateRangePicker}
//                 className="btn bg-black text-white shadow-xl my-10 hover:bg-white hover:text-black"
//               >
//                 {showDateRange ? "Cancel" : "Select Range"}
//               </button>
//               <div className="flex items-center gap-2 pl-4 max-w-[200px] my-10 h-12 rounded-lg bg-white border border-black hover:border-black focus:border-black border-solid border-2 shadow-xl">
//                 <IoMdSearch fontSize="1.125 rem" color="#000000" />
//                 <input
//                   type="text"
//                   className="flex h-10 pe-4 pb-1 w-full rounded-lg outline-none text-sm"
//                   placeholder="Search Employee"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             {showDateRange && (
//               <DateRange
//                 editableDateInputs={true}
//                 onChange={(item) => setDateRange([item.selection])}
//                 moveRangeOnFirstSelection={false}
//                 ranges={dateRange}
//               />
//             )}
//           </div>
//         </div>
//         <div className="flex flex-row gap-5 my-10">
//           <div>
//             <button
//               onClick={handleSearch}
//               className="btn bg-gray-700 text-white shadow-xl hover:bg-white hover:text-black"
//             >
//               Search
//             </button>
//           </div>
//           <div>
//             <button
//               onClick={() => setSearch('')}
//               className="btn bg-white text-black shadow-xl hover:bg-white hover:text-black"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       <RecapEmployeeTable
//         data={filteredData}
//         loading={loadingRecapAttendance}
//       />
//     </Layout>
//   );
// }
