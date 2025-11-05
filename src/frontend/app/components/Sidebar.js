"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getMyEvents, updateEventStatus, deleteEvent, getEvents, getSwapRequests, respondSwapRequest } from "../store/reducers/eventSlice";

export default function Sidebar() {
    const dispatch = useDispatch();

    const { myEvents, loading, swapRequests } = useSelector((state) => state.events);

    const [user, setUser] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
        dispatch(getMyEvents());
    }, [dispatch]);

    const handleRefresh = () => dispatch(getMyEvents());

    const toggleStatus = async (event) => {
        setActionLoadingId(event._id);
        await dispatch(updateEventStatus({
            id: event._id,
            status: event.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE"
        }));
        dispatch(getMyEvents());
        setActionLoadingId(null);
    };

    const handleDelete = async (event) => {
        if (!confirm("Delete this event?")) return;
        setActionLoadingId(event._id);
        await dispatch(deleteEvent(event._id));
        dispatch(getMyEvents());
        dispatch(getEvents())
        setActionLoadingId(null);
    };

    const handleRespondSwap = async (requestId, accept) => {
        try {
            await dispatch(respondSwapRequest({ requestId, accept })).unwrap();
            // no need to refresh manually; state is already updated in slice
        } catch (error) {
            console.error(error);
            alert("Failed to respond to swap request.");
        }
    };

    useEffect(() => {
        dispatch(getSwapRequests());
    }, [dispatch]);

    return (
        <aside className="w-full lg:w-80 bg-white border-r min-h-screen p-5 flex flex-col gap-6">

            {/* User Profile */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border shadow-sm">
                <img
                    src="https://www.freeiconspng.com/thumbs/profile-icon-png/account-profile-user-icon--icon-search-engine-10.png"
                    alt="User Profile"
                    className="w-14 h-14 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                    <div className="font-semibold text-gray-800">{user?.name || "User"}</div>
                    <div className="text-sm text-gray-500">{user?.email || ""}</div>
                </div>
            </div>

            {/* Refresh Button */}
            <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                onClick={handleRefresh}
                disabled={loading}
            >
                {loading ? "Refreshing..." : "Refresh My Events"}
            </button>

            {/* My Events List */}
            <div className="flex-1 overflow-auto">
                <h3 className="text-md font-semibold mb-3 text-gray-700">My Events</h3>
                {!myEvents?.length && (
                    <div className="text-sm text-gray-400">No events yet.</div>
                )}
                <ul className="space-y-3">
                    {myEvents?.map(ev => (
                        <li
                            key={ev._id}
                            className="p-4 rounded-2xl border bg-white shadow hover:shadow-md transition flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-gray-800">{ev.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(ev.startTime), "MMM d, yyyy, h:mm aa")} —{" "}
                                        {format(new Date(ev.endTime), "h:mm aa")}
                                    </div>
                                    <span
                                        className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium
                  ${ev.status === "SWAPPABLE"
                                                ? "bg-green-100 text-green-800"
                                                : ev.status === "SWAP_PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {ev.status}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleStatus(ev)}
                                        disabled={actionLoadingId === ev._id}
                                        className="px-3 py-1 text-xs rounded-lg bg-white border hover:bg-gray-50 transition"
                                    >
                                        {ev.status === "SWAPPABLE" ? "Make Busy" : "Make Swappable"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ev)}
                                        disabled={actionLoadingId === ev._id}
                                        className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Swap Requests */}
            <div>
                <h3 className="text-md font-semibold mb-3 text-gray-700">Swap Requests</h3>
                {!swapRequests?.length && (
                    <div className="text-sm text-gray-400">No swap requests</div>
                )}
                <ul className="space-y-3">
                    {swapRequests?.map(req => (
                        <li
                            key={req._id}
                            className="p-4 rounded-2xl border bg-white shadow hover:shadow-md transition flex flex-col gap-3"
                        >
                            <div className="text-sm">
                                <span className="font-semibold">{req.requester?.name || "Unknown"}</span> wants to swap:
                                <div className="ml-2 mt-1 text-xs text-gray-600">
                                    Your slot: {req.theirSlot?.title || "Deleted"}{" "}
                                    {req.theirSlot?.startTime ? `(${format(new Date(req.theirSlot.startTime), "h:mm aa")})` : ""}
                                    <br />
                                    Requested slot: {req.mySlot?.title || "Deleted"}{" "}
                                    {req.mySlot?.startTime ? `(${format(new Date(req.mySlot.startTime), "h:mm aa")})` : ""}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => handleRespondSwap(req._id, true)}
                                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => dispatch(respondSwapRequest({ requestId: req._id, accept: false }))}
                                    className="flex-1 px-3 py-1 text-xs rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tip */}
            <div className="text-xs text-gray-500 mt-4">
                ✅ Tip: Mark an event as <span className="font-semibold">Swappable</span> to allow swap requests.
            </div>
        </aside>

    );
}
