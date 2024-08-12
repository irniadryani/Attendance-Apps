import React from "react";
import NotFoundImage from "../assets/notfound1.png";

export default function PageNotFound() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center my-20">
        <div>
          <img src={NotFoundImage} />
        </div>
        <div>
          <p className="font-bold text-[#39496f] text-xl text-center">Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
