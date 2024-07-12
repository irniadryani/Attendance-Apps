import React from "react";

export default function FilterByDate() {
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
}
