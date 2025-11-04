import Calender from "./Calender";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    return (
        <div className="flex gap-3 h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg border-r">
                <Sidebar />
            </div>

            {/* Calendar Area */}
            <div className="flex-1 p-4 overflow-hidden">
                <Calender />
            </div>
        </div>

    )
}