import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { getAllAttendanceFn } from '../../api/attendance/attendance';
import { getAllPermissionFn } from '../../api/permission/permission';
import { getAllDailyReportFn } from '../../api/dailyReport/dailyReport';

// Import Chart.js tooltip plugin
Chart.register(Tooltip);
Chart.register(ArcElement);

const ChartComponent = () => {
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [permissionCount, setPermissionCount] = useState(0);
  const [dailyReportCount, setDailyReportCount] = useState(0);

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
    data: dataDailyReport,
    refetch: refetchDailyReport,
    isLoading: loadingDailyReport,
  } = useQuery({
    queryKey: ['dailyReport'],
    queryFn: getAllDailyReportFn,
  });

  useEffect(() => {
    if (dataAttendance) {
      setAttendanceCount(dataAttendance.length);
    }
  }, [dataAttendance]);

  useEffect(() => {
    if (dataPermission) {
      setPermissionCount(dataPermission.length);
    }
  }, [dataPermission]);

  useEffect(() => {
    if (dataDailyReport) {
      setDailyReportCount(dataDailyReport.length);
    }
  }, [dataDailyReport]);

  const data = {
    labels: ['Attendance', 'Permission', 'Daily Report'],
    datasets: [
      {
        data: [attendanceCount, permissionCount, dailyReportCount],
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
