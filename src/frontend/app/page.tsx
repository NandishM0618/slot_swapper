import Dashboard from "./components/Dashboard"
import ProtectedRoute from './components/ProtectedRoute'

export default function Home() {
  return (
    <div className="">
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
}
