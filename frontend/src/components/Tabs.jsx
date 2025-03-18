import React from 'react'

export const Tabs = ({
    activeButton,
    setActiveButton,
    buttons
}) => {
    return (
        <div className="flex justify-between bg-gray-100 p-[6px] rounded-full w-full">
            {buttons?.map((button, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => setActiveButton(button)}
                    className={`px-4 py-2 text-sm font-medium flex items-center transition-all duration-300 ${activeButton === button
                        ? "bg-white text-black shadow-md transform"
                        : "bg-gray-100 text-gray-500 transform"
                        } rounded-full cursor-pointer`}
                >
                    {button}
                </button>
            ))}
        </div>
    )
}