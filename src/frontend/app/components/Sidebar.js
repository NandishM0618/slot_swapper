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

    useEffect(() => {
        dispatch(getSwapRequests());
    }, [dispatch]);

    return (
        <aside className="w-80 bg-white border-r min-h-screen p-4 flex flex-col gap-4">

            <div className="flex items-center gap-3 p-3 rounded-md bg-gray-100 border">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                    <div className="font-semibold text-sm">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500">{user?.email || ""}</div>
                </div>
            </div>

            <button
                className="bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
                onClick={handleRefresh}
                disabled={loading}
            >
                {loading ? "Refreshing..." : "Refresh My Events"}
            </button>

            <div className="flex-1 overflow-auto">
                <h3 className="text-sm font-semibold mb-2">My Events</h3>

                {!myEvents?.length && (
                    <div className="text-sm text-gray-500">No events yet.</div>
                )}

                <ul className="space-y-3">
                    {myEvents?.map(ev => (
                        <li key={ev._id} className="p-3 rounded-md border bg-white shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start">

                                {/* Event Info */}
                                <div>
                                    <div className="font-medium text-sm">{ev.title}</div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(ev.startTime), "MMM d, yyyy, h:mm aa")} —{" "}
                                        {format(new Date(ev.endTime), "h:mm aa")}
                                    </div>

                                    <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium
                                        ${ev.status === "SWAPPABLE"
                                            ? "bg-green-100 text-green-700"
                                            : ev.status === "SWAP_PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
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
                                        className="px-2 py-1 text-xs rounded-md bg-white border hover:bg-gray-50"
                                    >
                                        {ev.status === "SWAPPABLE" ? "Make Busy" : "Make Swappable"}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(ev)}
                                        disabled={actionLoadingId === ev._id}
                                        className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Swap Requests</h3>
                {!swapRequests?.length && (
                    <div className="text-sm text-gray-500">No swap requests</div>
                )}

                <ul className="space-y-3">
                    {swapRequests?.map(req => (
                        <li key={req._id} className="p-3 rounded-md border bg-white shadow-sm flex flex-col gap-2">
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

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => dispatch(respondSwapRequest({ requestId: req._id, accept: true }))}
                                    className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => dispatch(respondSwapRequest({ requestId: req._id, accept: false }))}
                                    className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-xs text-gray-500">
                ✅ Tip: Mark an event as <span className="font-semibold">Swappable</span> to allow swap requests.
            </div>
        </aside>
    );
}
