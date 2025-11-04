'use client'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns"
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

const dummyEvents = [
    {
        title: "Team Meeting",
        start: new Date(2025, 10, 13, 10, 0),
        end: new Date(2025, 10, 13, 11, 0),
        user: "User A",
        swappable: true,
    },
    {
        title: "Focus Block",
        start: new Date(2025, 10, 15, 14, 0),
        end: new Date(2025, 10, 15, 15, 0),
        user: "User B",
        swappable: false,
    },
];

const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
];

export default function Calender() {
    const [hoverEvent, setHoverEvent] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [selectedDate, setSelectedDate] = useState(null);

    const onEventHover = (event, e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        setHoverEvent(event);
    };

    const onEventLeave = () => setHoverEvent(null);

    const handleDateClick = ({ start }) => {
        setSelectedDate(start);
    };

    return (
        <div className="flex gap-6 p-7">

            <div className="relative p-5 w-[60%]">
                <Calendar
                    localizer={localizer}
                    events={dummyEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 800, fontSize: 20, cursor: "pointer" }}
                    views={["month", "week", "day"]}
                    defaultView="month"
                    selectable
                    onSelectSlot={handleDateClick}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.swappable ? "#4ade80" : "#60a5fa",
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
                        <p><b>User:</b> {hoverEvent.user}</p>
                        <p><b>Slot:</b> {hoverEvent.title}</p>
                        <p>
                            {hoverEvent.swappable ? (
                                <span className="text-green-600 font-bold">Swappable ✅</span>
                            ) : (
                                <span className="text-red-600 font-bold">Not Swappable ❌</span>
                            )}
                        </p>
                    </div>
                )}
            </div>

            <div className="w-[40%] p-4 rounded-lg bg-gray-50">
                {selectedDate ? (
                    <>
                        <h2 className="text-lg font-bold mb-2">
                            Available Slots – {selectedDate.toDateString()}
                        </h2>

                        <div className="flex flex-col gap-2 overflow-auto max-h-screen">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    className="p-2 bg-white text-2xl h-20 border rounded hover:bg-blue-100 transition"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600">Click on a date to view available slots.</p>
                )}
            </div>
        </div>
    );
}
