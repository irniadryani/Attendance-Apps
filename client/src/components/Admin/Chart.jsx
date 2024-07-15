import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { getAllAttendanceFn } from '../../api/attendance/attendance';
import { getAllPermissionFn } from '../../api/permission/permission';
import { getAllLeavesFn } from '../../api/leaves/leaves';

// Import Chart.js tooltip plugin
Chart.register(Tooltip);
Chart.register(ArcElement);

const ChartComponent = () => {
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [permissionCount, setPermissionCount] = useState(0);
  const [leavesCount, setLeavesCount] = useState(0);

  const {
    data: dataAttendance,
    refetch: refetchAttendance,
    isLoading: loadingAttendance,
  } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAllAttendanceFn,
  });

  const {
    data: dataPermission,
    refetch: refetchPermission,
    isLoading: loadingPermission,
  } = useQuery({
    queryKey: ['permission'],
    queryFn: getAllPermissionFn,
  });

  const {
    data: dataLeaves,
    refetch: refetchLeaves,
    isLoading: loadingLeaves,
  } = useQuery({
    queryKey: ['leaves'],
    queryFn: getAllLeavesFn,
  });

  useEffect(() => {
    if (dataAttendance?.attendances) {
      setAttendanceCount(dataAttendance?.attendances?.length);
    }
  }, [dataAttendance?.attendances]);

  useEffect(() => {
    if (dataPermission) {
      setPermissionCount(dataPermission.length);
    }
  }, [dataPermission]);

  useEffect(() => {
    if (dataLeaves) {
      setLeavesCount(dataLeaves.length);
    }
  }, [dataLeaves]);

  const data = {
    labels: ['Attendance', 'Permission', 'Leaves'],
    datasets: [
      {
        data: [attendanceCount, permissionCount, leavesCount],
        backgroundColor: ['rgb(204, 234, 187)', 'rgb(63, 63, 68)', 'rgb(253, 203, 158)'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
