import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

export default function FormAddUser() {
  return (
    <div>
      FormAddUser
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            className="input input-bordered w-full"
            placeholder="Full Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            className="input input-bordered w-full"
            placeholder="Password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select name="role" className="select select-bordered w-full">
            <option value="">Select Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Superadmin">Superadmin</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            className="input input-bordered w-full"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Position</label>
          <input
            type="text"
            name="position"
            className="input input-bordered w-full"
            placeholder="Position"
            required
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}
