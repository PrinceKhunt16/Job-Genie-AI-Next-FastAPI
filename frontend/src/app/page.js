"use client";

import Popup from '@/components/Popup';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie";
import { IoMdSettings } from "react-icons/io";

const ManageCompaniesPage = () => {
  const [selectedURLs, setSelectedURLs] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobInput, setJobInput] = useState("");
  const [disableAll, setDisableAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && jobInput.trim()) {
      setJobTitles((prev) => [...prev, jobInput.trim()]);
      setJobInput("");
    }
  };

  const handleRemoveTitle = (index) => {
    const updatedTitles = jobTitles.filter((_, i) => i !== index);
    setJobTitles(updatedTitles);
  };

  const handleSaveSettings = () => {
    const normalizedJobTitles = jobTitles.map((title) =>
      title.trim().toLowerCase()
    );

    const filteredJobs = jobs.filter((job) =>
      normalizedJobTitles.includes(job.title.trim().toLowerCase())
    );

    setFilteredJobs(filteredJobs);

    localStorage.setItem("jobTitles", JSON.stringify(jobTitles));
    closePopup();
  }

  const handleGetJobs = async (company) => {
    setDisableAll(true);
    setLoading(true);
    setCurrentCompany(company);
    setFilteredJobs([]);
    setJobs([]);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
        url: company.url,
        job_titles: jobTitles
      });

      setJobs(response.data.jobs);

      const normalizedJobTitles = jobTitles.map((title) =>
        title.trim().toLowerCase()
      );

      const filteredJobs = jobs.filter((job) =>
        normalizedJobTitles.includes(job.title.trim().toLowerCase())
      );

      setFilteredJobs(filteredJobs);
    } catch (e) {
      console.error("Error getting jobs:", e.response?.data || e.message);
    } finally {
      setDisableAll(false);
      setLoading(false);
    }
  }

  const handleRedirectToJobPage = () => {
    window.open(currentCompany.url, "_blank");
  }

  useEffect(() => {
    const savedTitles = JSON.parse(localStorage.getItem("jobTitles")) || [];
    setJobTitles(savedTitles);
  }, []);

  useEffect(() => {
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
              <div className="col-span-1">
                <div className="w-full pt-6 pl-4 pr-4 min-h-screen border-r border-gray-300">
                  <h2 className="text-3xl font-bold mb-4">Companies</h2>
                  <div className="flex flex-wrap gap-2 max-h-[calc(100vh-80px)] overflow-y-scroll">
                    {selectedURLs.map((company) => (
                      <button
                        key={company.id}
                        className={`border border-black py-2 px-4 font-bold ${disableAll ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 cursor-pointer hover:bg-gray-300'}`}
                        onClick={() => handleGetJobs(company)}
                        disabled={disableAll}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="w-full pt-6 pr-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">Current Openings {currentCompany && `- ${currentCompany.name}`}</h2>
                    <button className="bg-gradient-to-b from-fuchsia-700 to-blue-600/90 p-2 rounded-full text-lg font-bold cursor-pointer" onClick={openPopup}>
                      <IoMdSettings fontSize={24} color='white' />
                    </button>
                  </div>
                  <div className='max-h-[calc(100vh-80px)] overflow-y-scroll'>
                    {loading ? (
                      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] h-full">
                        <p className="text-2xl font-bold">Searching in {currentCompany.name}'s page...</p>
                      </div>
                    ) : (
                      <div>
                        {currentCompany && (
                          <div className='flex gap-2 pb-4'>
                            <button
                              className={`border border-black py-2 px-4 font-bold cursor-pointer ${!isFiltered ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                              onClick={() => setIsFiltered(false)}
                            >
                              Unfiltered Results
                            </button>
                            <button
                              className={`border border-black py-2 px-4 font-bold cursor-pointer ${isFiltered ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                              onClick={() => setIsFiltered(true)}
                            >
                              Filtered Results
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap pb-4">
                          {isFiltered ? (
                            <>
                              {filteredJobs.map((job, index) => (
                                <div
                                  key={index}
                                  className="w-full sm:w-[calc(50%-1rem)] p-6 bg-gray-100 hover:bg-gray-200 border-r border-r-gray-300 border-b border-b-gray-300"
                                >
                                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                                  <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">Location:</span> {job.location}
                                  </p>
                                  <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">Description:</span>{" "}
                                    {job.description}
                                  </p>
                                  <button
                                    onClick={() => handleRedirectToJobPage()}
                                    className="cursor-pointer w-full mt-4 px-4 py-2 bg-gradient-to-r from-fuchsia-700 to-blue-600/90 text-white rounded-full transition-colors"
                                  >
                                    Click Me
                                  </button>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {jobs.map((job, index) => (
                                <div
                                  key={index}
                                  className="w-full sm:w-[calc(50%-1rem)] p-6 bg-gray-100 hover:bg-gray-200 border-r border-r-gray-300 border-b border-b-gray-300"
                                >
                                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                                  <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">Location:</span> {job.location}
                                  </p>
                                  <p className="mt-2 text-gray-600">
                                    <span className="font-semibold">Description:</span>{" "}
                                    {job.description}
                                  </p>
                                  <button
                                    onClick={() => handleRedirectToJobPage()}
                                    className="cursor-pointer w-full mt-4 px-4 py-2 bg-gradient-to-r from-fuchsia-700 to-blue-600/90 text-white rounded-full transition-colors"
                                  >
                                    Click Me
                                  </button>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Filter job titles"
        handleOnConfirm={handleSaveSettings}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="jobtitle" className="block mb-2 font-medium">Job Title</label>
            <input
              type="text"
              id="jobtitle"
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter Job Title"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 max-h-[calc(100vh-80px)] overflow-y-scroll">
            {jobTitles.map((title, index) => (
              <button
                key={index}
                onClick={() => handleRemoveTitle(index)}
                className="cursor-pointer border border-black py-2 px-4 font-bold bg-gray-100 hover:bg-red-200 transition"
              >
                {title}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Add job titles which you want to find in these companies list.
          </p>
        </div>
      </Popup>
    </>
  );
};

export default ManageCompaniesPage;