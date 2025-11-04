'use client'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns"
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createEvent, getEvents } from "../store/reducers/eventSlice";
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


    const onEventHover = (event, e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        setHoverEvent(event);
    };

    const dispatch = useDispatch()

    const { events = [] } = useSelector(state => state.events);
    const { user } = useSelector(state => state.auth);

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

        </div>
    );
}
