"use client";

import Popup from '@/components/Popup';
import React, { useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie";

const ManageCompaniesPage = () => {
    const [availableURLs, setAvailableURLs] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newURL, setNewURL] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [selectedURLs, setSelectedURLs] = useState([]);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const authToast = (message) => toast.custom(
        <div className="flex gap-3 bg-white text-black p-4 rounded-full border border-gray-200 shadow-lg min-w-80 toast-enter toast-enter-active">
            <div className="flex justify-center items-center bg-slate-100 w-11 h-11 rounded-full">
                🔥
            </div>
            <div className="flex justify-center items-center">
                <p className="text">{message}</p>
            </div>
        </div>
    );

    const handleAddURL = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/add`, {
                name: companyName,
                url: newURL,
            });

            authToast("Company added successfully");
            await fetchCompniesList();
        } catch (e) {
            console.error("Error adding company:", e.response?.data || e.message);
        }

        closePopup();
    };

    const handleSelectURL = (id) => {
        const selectedURL = availableURLs.find((url) => url.id === id);
        const isAvailabel = selectedURLs.find((url) => url.id === id);

        if (!isAvailabel) {
            setSelectedURLs([...selectedURLs, selectedURL])
        } 
    };

    const handleRemoveURL = (id) => {
        setSelectedURLs(selectedURLs.filter((selectedUrl) => selectedUrl.id !== id));
    };    

    const handleSave = async () => {
        try {
            const companies_urls = selectedURLs.map((company) => company.id);
            
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/save`, {
                user_id: Cookies.get("uid"),
                companies: companies_urls
            });

            authToast("Company saved successfully");
            await fetchUserCompanies();
        } catch (e) {
            console.error("Error adding company:", e.response?.data || e.message);
        }
    };

    const fetchCompniesList = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`);
            setAvailableURLs(response.data)
        } catch (e) {
            console.error("Error adding company:", e.response?.data || e.message);
        }
    }

    const fetchUserCompanies = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/companies`, {
                user_id: Cookies.get("uid")
            });
            setSelectedURLs(response.data)
        } catch (e) {
            console.error("Error adding company:", e.response?.data || e.message);
        }
    }

    useEffect(() => {
        const fetchCompniesList = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`);
                setAvailableURLs(response.data)
            } catch (e) {
                console.error("Error adding company:", e.response?.data || e.message);
            }
        }

        const fetchUserCompanies = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/companies`, {
                    user_id: Cookies.get("uid")
                });
                setSelectedURLs(response.data)
            } catch (e) {
                console.error("Error adding company:", e.response?.data || e.message);
            }
        }

        fetchCompniesList();
        fetchUserCompanies();
    }, []);

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    removeDelay: 1000,
                    transition: "toast-enter-active toast-exit-active"
                }}
            />
            <div className="flex flex-col md:flex-row h-screen">
                <div className="flex-1">
                    <div className="max-w-6xl mx-auto bg-cream-100 overflow-hidden">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <div className="w-full pt-6 pr-4 pl-4 border-r min-h-screen border-gray-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-3xl font-bold">Manage Companies</h2>
                                        <button className="bg-gradient-to-b from-fuchsia-700 to-blue-600/90 p-2 rounded-full text-lg font-bold cursor-pointer" onClick={openPopup}>
                                            <IoMdAdd fontSize={24} color='white' />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pb-4 max-h-[calc(100vh-86px)] overflow-y-scroll">
                                        {availableURLs.map((company) => (
                                            <button
                                                key={company.id}
                                                className="cursor-pointer border border-black py-2 px-4 font-bold bg-gray-200 hover:bg-gray-300"
                                                onClick={() => handleSelectURL(company.id)}
                                            >
                                                {company.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="w-full py-6 pr-4">
                                    <h2 className="text-3xl font-bold mb-4">Selected Companies</h2>
                                    <div className="flex flex-wrap gap-2 mb-4 max-h-[calc(100vh-170px)] overflow-y-scroll">
                                        {selectedURLs.map((company) => (
                                            <button
                                                key={company.id}
                                                className="cursor-pointer border border-black py-2 px-4 font-bold bg-gray-200 hover:bg-gray-300"
                                                onClick={() => handleRemoveURL(company.id)}
                                            >
                                                {company.name}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="w-full bg-gradient-to-r from-fuchsia-700 to-blue-600/90 text-white cursor-pointer py-3 rounded-full text font-bold"
                                        onClick={() => handleSave()}
                                    >
                                        Save Companies List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={closePopup}
                title="Add New URL"
                handleOnConfirm={handleAddURL}
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="companyname" className="block mb-2 font-medium">Company Name</label>
                        <input
                            type="text"
                            id="companyname"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter company or website name"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyurl" className="block mb-2 font-medium">Company URL</label>
                        <input
                            type="text"
                            id="companyurl"
                            value={newURL}
                            onChange={(e) => setNewURL(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter its carear page URL"
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Add a new URL to your available URLs list.
                    </p>
                </div>
            </Popup>
        </>
    );
};

export default ManageCompaniesPage;