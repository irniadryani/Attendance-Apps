import React from "react";
import { getAllAnnouncementFn } from "../../api/announcement/announcement";
import { useQuery } from "@tanstack/react-query";

export default function Announcement() {
  const {
    data: dataAnnouncement,
    refetch: refetchAnnouncement,
    isLoading: loadingAnnouncement,
  } = useQuery({
    queryKey: ["allAnnouncement"],
    queryFn: getAllAnnouncementFn,
  });

  return (
    <div>
      <div>
        <div className="card bg-base-100 w-full h-72 shadow-2xl my-10">
          <div className="card-body">
            <h2 className="card-title text-center font-bold">Announcement!</h2>
            {dataAnnouncement?.map((announcement) => (
              <div className="card bg-base-100 w-full">
                <p>{announcement.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
