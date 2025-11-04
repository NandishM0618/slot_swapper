"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from '../store/reducers/authSlice'
import { useRouter } from "next/navigation";

export default function page(params) {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const dispatch = useDispatch();
    const router = useRouter();

    const { status, error } = useSelector((state) => state.auth);

    async function handleSignup(e) {
        e.preventDefault()

        try {
            await dispatch(signup({ name, email, password })).unwrap();
            alert("Account Created!!");
            router.push("/login")
        } catch (err) {
            console.error(err);
            alert("Account Creation Failed")
        }
    }
    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="bg-white mt-5 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center text-black mb-6">
                        Create Account
                    </h2>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-gray-600 font-medium mb-1"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                // placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-600 font-medium mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                // placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-600 font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                // placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition"
                        >
                            {status === "loading" ? "hold on..." : "Sign up"}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-blue-500 font-medium hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}