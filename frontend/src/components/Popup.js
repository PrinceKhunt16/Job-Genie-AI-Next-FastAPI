import React, { useState } from 'react';
import { MdOutlineClose } from "react-icons/md";

const Popup = ({ isOpen, onClose, title, handleOnConfirm, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-gradient-to-b from-fuchsia-700 to-blue-600"
                onClick={onClose}
            ></div>
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4 z-10">
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-500 hover:text-gray-700"
                    >
                       <MdOutlineClose fontSize={28} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
                <div className="flex justify-end gap-2 p-4 border-t">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 bg-green-200 rounded-lg font-bold hover:bg-green-300"
                        onClick={() => handleOnConfirm()}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup