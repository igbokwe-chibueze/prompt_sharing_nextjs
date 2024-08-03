"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * LoginPopup Component
 * Displays a popup encouraging the user to log in with a customizable message
 */
const LoginPopup = ({ message, onClose }) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login"); // Redirect to login page
    onClose(); // Close the popup after redirect
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Login Required</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleLoginRedirect}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
