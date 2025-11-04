'use client'
import { useEffect, useState } from "react";

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    function fetchUser() {
        try {
            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <aside className="w-80 bg-white border-r min-h-screen p-4 flex flex-col gap-4">

            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                    <div className="font-semibold text-sm">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500">{user?.email || ""}</div>
                </div>
            </div>

            <div className="flex gap-2">
                <button

                    className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm"
                // disabled={loading}
                >
                    Refresh events
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <h3 className="text-sm font-semibold mb-2">My Events</h3>

                {/* {error && <div className="text-red-500 text-sm mb-2">{error}</div>} */}

                {/* {!events.length && !loading && <div className="text-sm text-gray-500">No events yet.</div>} */}

                <ul className="space-y-3">
                    {/* {events?.map(ev => (
                        <li key={ev._id} className="p-3 rounded-md border bg-white">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <div className="font-medium text-sm">{ev.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(ev.startTime), "MMM d, yyyy, h:mm aa")} — {format(new Date(ev.endTime), "h:mm aa")}
                                    </div>
                                    <div className="text-xs mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs ${ev.status === "SWAPPABLE" ? "bg-green-100 text-green-800" : ev.status === "SWAP_PENDING" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-700"}`}>
                                            {ev.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <button

                                        className="text-sm text-blue-600 underline"
                                    >
                                        View
                                    </button>

                                    <div className="flex gap-2">
                                        <button

                                            disabled={actionLoadingId === ev._id}
                                            className="px-2 py-1 text-xs rounded-md border bg-white hover:bg-gray-50"
                                        >
                                            {ev.status === "SWAPPABLE" ? "Make Busy" : "Make Swappable"}
                                        </button>

                                        <button

                                            disabled={actionLoadingId === ev._id}
                                            className="px-2 py-1 text-xs rounded-md border bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))} */}
                </ul>
            </div>

            <div className="text-xs text-gray-500">
                Tip: Mark an event as <span className="font-semibold">Swappable</span> to let others request a swap.
            </div>
        </aside>
    )
}