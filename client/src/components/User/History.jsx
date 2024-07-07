import React from "react";

export default function History() {
  return (
    <div>
      <div>
        <p className="font-bold text-2xl mx-10 mt-10">History</p>
        <div className="flex justify-end mx-10">
          <div className="dropdown dropdown-hover mt-5">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-black text-white text-center w-24"
            >
              Sort
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 w-full shadow-xl">
          <div className="card-body">
            <div className="card bg-black text-neutral-content w-full flex flex-row justify-between">
              <div className="mx-5 mt-2">
                <p className="font-bold text-sm">Worked</p>
                <p className="font-semibold text-xs">9 hr 1 min</p>
              </div>
              <div>
                <button className="btn btn-light text-black btn-sm m-2">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
