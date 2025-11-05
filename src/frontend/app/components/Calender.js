'use client'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns"
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createEvent, createSwapRequest, fetchSwappableSlots, getEvents } from "../store/reducers/eventSlice";
import { useDispatch, useSelector } from "react-redux";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});


export default function Calender() {
    const [hoverEvent, setHoverEvent] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("BUSY");
    const [selectedSwapSlot, setSelectedSwapSlot] = useState(null);
    const [mySwapSlot, setMySwapSlot] = useState(null);
    const [showSwapModal, setShowSwapModal] = useState(false);


    const onEventHover = (event, e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        setHoverEvent(event);
    };

    const dispatch = useDispatch()

    const { events = [] } = useSelector(state => state.events);
    const { user } = useSelector(state => state.auth);
    const { swappableSlots = [] } = useSelector(state => state.events);

    const formattedEvents = events.map(evt => ({
        ...evt,
        start: new Date(evt.startTime),
        end: new Date(evt.endTime)
    }));
    const onEventLeave = () => setHoverEvent(null);

    const handleDateClick = ({ start }) => {
        setSelectedDate(start);
    };


    async function handleCreateEvent(e) {
        e.preventDefault();

        try {
            const start = new Date(selectedDate);
            const [sh, sm] = startTime.split(":");
            start.setHours(sh, sm);

            const end = new Date(selectedDate);
            const [eh, em] = endTime.split(":");
            end.setHours(eh, em);

            if (end <= start) {
                alert("End time must be greater than start time");
                return;
            }

            await dispatch(
                createEvent({
                    title,
                    startTime: start,
                    endTime: end,
                    owner: user?.id,
                    status
                })
            ).unwrap();

            alert("Event Created");

            setTitle("");
            setStartTime("");
            setEndTime("");
            setStatus("BUSY");
            dispatch(getEvents())
        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        }
    }

    useEffect(() => {
        dispatch(getEvents());
    }, [])

    useEffect(() => {
        dispatch(fetchSwappableSlots());
    }, [dispatch])

    return (
        <div className="flex gap-6 p-7">

            <div className="relative p-5 w-[60%]">
                <Calendar
                    localizer={localizer}
                    events={formattedEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 800, fontSize: 20, cursor: "pointer" }}
                    views={["month", "week", "day"]}
                    defaultView="month"
                    selectable
                    onSelectSlot={handleDateClick}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.status === "SWAPPABLE" ? "#4ade80" : "#60a5fa",
                            borderRadius: "10px",
                            padding: "8px",
                            cursor: "pointer",
                        },
                    })}
                    components={{
                        event: (props) => (
                            <div
                                onMouseEnter={(e) => onEventHover(props.event, e)}
                                onMouseLeave={onEventLeave}
                            >
                                {props.title}
                            </div>
                        ),
                    }}
                />

                {hoverEvent && (
                    <div
                        className="fixed bg-white shadow-lg border rounded-md p-3 text-sm z-50"
                        style={{ top: mousePos.y + 10, left: mousePos.x + 10 }}
                    >
                        <p><b>User:</b> {hoverEvent.owner?.name || "You"}</p>
                        <p><b>Title:</b> {hoverEvent.title}</p>
                        <p>
                            {hoverEvent.status === "SWAPPABLE" ? (
                                <span className="text-green-600 font-bold">Swappable ✅</span>
                            ) : (
                                <span className="text-red-600 font-bold">Busy ❌</span>
                            )}
                        </p>
                    </div>
                )}

            </div>

            <div className="w-[40%] p-4 rounded-lg bg-gray-50">
                {selectedDate ? (
                    <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">

                        <h2 className="text-lg font-bold mb-2">
                            Create Event – {selectedDate.toDateString()}
                        </h2>

                        <input
                            type="text"
                            placeholder="Event Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="p-2 border rounded-lg"
                        />


                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                            className="p-2 border rounded-lg"
                        />

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                            className="p-2 border rounded-lg"
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="p-2 border rounded-lg"
                        >
                            <option value="BUSY">Busy</option>
                            <option value="SWAPPABLE">Swappable</option>
                        </select>

                        <button
                            type="submit"
                            disabled={!title || !startTime || !endTime}
                            className={`mt-2 w-full py-3 rounded-lg font-semibold text-lg transition 
          ${title && startTime && endTime ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            Create Event
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-600">Click on a date to create an event.</p>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-bold mb-3">Available Swappable Slots</h2>

                {swappableSlots.length === 0 && (
                    <p className="text-gray-600">No swappable slots available right now.</p>
                )}

                <div className="space-y-2">
                    {swappableSlots.map(slot => (
                        <div
                            key={slot._id}
                            onClick={() => {
                                setSelectedSwapSlot(slot);
                                setShowSwapModal(true);
                            }}
                            className="p-3 bg-blue-100 border border-blue-400 rounded cursor-pointer hover:bg-blue-200"
                        >
                            <p><b>{slot.title}</b></p>
                            <p>{new Date(slot.startTime).toLocaleString()}</p>
                            <p className="text-sm text-gray-700">
                                User: {slot.owner?.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {showSwapModal && selectedSwapSlot && (
                <div className="fixed z-50 inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[400px] shadow-xl">

                        <h2 className="text-lg font-bold mb-3">Swap Request</h2>
                        <div className="mb-4 p-3 border rounded bg-gray-100">
                            <p><b>Selected Slot:</b> {selectedSwapSlot.title}</p>
                            <p>{new Date(selectedSwapSlot.startTime).toLocaleString()}</p>
                            <p>User: {selectedSwapSlot.owner?.name}</p>
                        </div>

                        <p className="font-semibold mb-2">Choose Your Swappable Slot:</p>

                        {formattedEvents
                            .filter(e => e.status === "SWAPPABLE")
                            .map(e => (
                                <div
                                    key={e._id}
                                    onClick={() => setMySwapSlot(e)}
                                    className={`p-3 border rounded mb-2 cursor-pointer
              ${mySwapSlot?._id === e._id ? "bg-green-200 border-green-500" : "bg-white"}`}
                                >
                                    <p><b>{e.title}</b></p>
                                    <p>{e.start.toLocaleString()}</p>
                                </div>
                            ))}

                        {mySwapSlot && (
                            <button
                                onClick={async () => {
                                    await dispatch(createSwapRequest({
                                        mySlotId: mySwapSlot._id,
                                        theirSlotId: selectedSwapSlot._id
                                    }));
                                    alert("Swap Request Sent");
                                    setShowSwapModal(false);
                                    setMySwapSlot(null);
                                }}
                                className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                Send Swap Request
                            </button>
                        )}

                        <button
                            onClick={() => setShowSwapModal(false)}
                            className="w-full mt-2 bg-gray-300 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
