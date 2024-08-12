import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import AnnouncementLogo from "../../assets/announce.png";
import { IoCreateOutline } from "react-icons/io5";
import {
  getAllAnnouncementFn,
  deleteAnnouncementFn,
} from "../../api/announcement/announcement";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import CreateAnnouncement from "../../components/Admin/CreateAnnouncement";
import UpdateAnnouncement from "../../components/Admin/UpdateAnnouncement";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function Announcement() {
  const [announcementIdToDelete, setAnnouncementIdToDelete] = useState(null);
  const [announcementToUpdate, setAnnouncementToUpdate] = useState(null);

  const {
    data: dataAnnouncement,
    refetch: refetchAnnouncement,
    isLoading: loadingAnnouncement,
  } = useQuery({
    queryKey: ["allAnnouncement"],
    queryFn: getAllAnnouncementFn,
  });

  const handleDeleteAnnouncement = useMutation({
    mutationFn: (data) => deleteAnnouncementFn(data),
    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      refetchAnnouncement();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleConfirmDelete = async () => {
    try {
      // Tampilkan alert konfirmasi SweetAlert
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await handleDeleteAnnouncement.mutateAsync(announcementIdToDelete);
        Swal.fire({
          title: "Deleted!",
          text: "Your announcement has been deleted.",
          icon: "success",
        });
      }

      if (result.isDismissed || result.isDenied) {
        setAnnouncementIdToDelete(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (announcementIdToDelete !== null) {
      handleConfirmDelete();
    }
  }, [announcementIdToDelete]);

  const openUpdateModal = (announcementId) => {
    document.getElementById("update_announcement_modal").showModal();
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-center items-center w-full rounded-xl bg-black h-56">
          <div className="flex flex-row gap-5 my-10 justify-center items-center">
            <div>
              <img src={AnnouncementLogo} className="w-24" />
            </div>
            <div>
              <div className="flex flex-col">
                <p className="font-bold text-3xl text-white">Create</p>
                <p className="font-bold text-3xl text-white">Announcement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="btn bg-black text-white my-5"
            onClick={() =>
              document.getElementById("create_announcement_modal").showModal()
            }
          >
            <IoCreateOutline />
            Create Announcement
          </button>
        </div>

        <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {dataAnnouncement?.map((announcement) => (
            <div className="card bg-black w-72 shadow-xl">
              <div className="flex flex-row gap-1 justify-between mx-3 mt-3">
                <div className="flex justify-start">
                  <p className="text-xs text-start text-white font-semibold ml-5">
                    2024-07-09
                  </p>
                </div>
                <div className="flex flex-row">
                  <div>
                    <button
                      onClick={() => {
                        setAnnouncementToUpdate(announcement);
                        openUpdateModal(announcement.id);
                      }}
                    >
                      <MdEdit color="white" size={20} />
                    </button>
                  </div>
                  <div>
                    <a
                      onClick={() => {
                        setAnnouncementIdToDelete(announcement.id);
                      }}
                    >
                      <MdDeleteOutline color="white" size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div></div>
              <div className="card-body">
                <p className="font-medium text-sm text-white">
                  {announcement.message}
                </p>
              </div>
            </div>
          ))}
        </div>
       
      </div>
      <CreateAnnouncement refetch={refetchAnnouncement} />

      <UpdateAnnouncement
        announcement={announcementToUpdate}
        refetch={refetchAnnouncement}
      />
    </Layout>
  );
}
