"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from "next/link";
import { Tabs } from "@/components/Tabs";
import axios from "axios";
import Cookies from "js-cookie";

export default function AuthPage() {
    const router = useRouter();
    const [activeButton, setActiveButton] = useState("✌️ Sign In");
    const [signUp, setSignUp] = useState({
        username: "Prince Khunt",
        email: "princekhunt@gmail.com",
        password: "prince232"
    });
    const [signIn, setSignIn] = useState({
        email: "princekhunt@gmail.com",
        password: "prince232",
    });

    const onChangeSignIn = (e, field) => {
        setSignIn((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    }

    const onChangeSignUp = (e, field) => {
        setSignUp((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    }

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

    const onSubmitSignUp = async (e) => {
        e.preventDefault();

        if (signUp.email === "" || signUp.password === "" || signUp.name === "") {
            authToast();
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
                username: signUp.username,
                email: signUp.email,
                password: signUp.password,
            });

            const { access_token, user_id } = response.data;
            const now = new Date();
            const expirationTime = new Date(now.getTime() + 30 * 60 * 1000);

            Cookies.set("x-api-k-token", access_token, {
                secure: true,
                sameSite: "Strict",
                expires: expirationTime
            });
            
            Cookies.set("uid", user_id, {    
                secure: true,
                sameSite: "Strict",
                expires: expirationTime
            })
            
            router.push("/");
        } catch (error) {
            authToast(error.response?.data.detail || "Sign-up failed"); 
        }
    }

    const onSubmitSignIn = async (e) => {
        e.preventDefault();

        if (signIn.email === "" || signIn.password === "") {
            authToast();
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`, {
                email: signIn.email,
                password: signIn.password,
            });

            const { access_token, user_id } = response.data;
            const now = new Date();
            const expirationTime = new Date(now.getTime() + 30 * 60 * 1000);

            Cookies.set("x-api-k-token", access_token, {
                secure: true,
                sameSite: "Strict",
                expires: expirationTime
            });
            
            Cookies.set("uid", user_id, {    
                secure: true,
                sameSite: "Strict",
                expires: expirationTime
            })

            router.push("/");
        } catch (error) {
            authToast(error.response?.data.detail || "Login failed"); 
        }
    }

    return (
        <div className="flex justify-center min-h-screen relative">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    removeDelay: 1000,
                    transition: "toast-enter-active toast-exit-active"
                }}
            />
            <div className="relative z-10">
                <div className="pt-10 w-full">
                    <div className="flex justify-center mb-12 w-fit m-auto">
                        <Tabs
                            activeButton={activeButton}
                            setActiveButton={setActiveButton}
                            buttons={["✌️ Sign In", "😊 Sign Up"]}
                            defaultButton={"✌️ Sign In"}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center mb-14">
                        <h1 className="text-6xl">{activeButton === "✌️ Sign In" ? "Sign In" : "Sign Up"}</h1>
                    </div>
                    <div className="flex justify-center items-center mb-14">
                        <form className="min-w-[320px] w-full">
                            {activeButton === "✌️ Sign In" ? (
                                <>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="inemail"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="inemail"
                                            className="w-full px-4 py-2 text-gray-900 bg-transparent border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter email"
                                            value={signIn.email}
                                            onChange={(e) => onChangeSignIn(e, "email")}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="inpassword"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="inpassword"
                                            className="w-full px-4 py-2 text-gray-900 bg-transparent border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter password"
                                            value={signIn.password}
                                            onChange={(e) => onChangeSignIn(e, "password")}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <Link href="/forgot-password" className="text-sm text-gray-500 underline hover:text-gray-700">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <button
                                        type="submit"
                                        className="cursor-pointer text-lg w-full p-2 text-white bg-black rounded-xl hover:bg-gray-800"
                                        onClick={(e) => onSubmitSignIn(e)}
                                    >
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="upname"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="upname"
                                            className="w-full px-4 py-2 text-gray-900 bg-transparent border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter name"
                                            value={signUp.username}
                                            onChange={(e) => onChangeSignUp(e, "username")}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="upemail"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="upemail"
                                            className="w-full px-4 py-2 text-gray-900 bg-transparent border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter email"
                                            value={signUp.email}
                                            onChange={(e) => onChangeSignUp(e, "email")}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="uppassword"
                                            className="block font-medium text-gray-700 mb-2"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="uppassword"
                                            className="w-full px-4 py-2 text-gray-900 bg-transparent border border-gray-400 rounded-xl focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Enter password"
                                            value={signUp.password}
                                            onChange={(e) => onChangeSignUp(e, "password")}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="cursor-pointer text-lg w-full p-2 text-white bg-black rounded-xl hover:bg-gray-800"
                                        onClick={(e) => onSubmitSignUp(e)}
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}