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
        <div className="card bg-base-100 w-full h-full shadow-2xl ">
          <div className="card-body">
            <h2 className="card-title text-center font-bold">Announcement!</h2>
            {dataAnnouncement?.map((announcement) => (
              <div className="card bg-base-100 w-full my-2 h-full">
                <p>{announcement.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
