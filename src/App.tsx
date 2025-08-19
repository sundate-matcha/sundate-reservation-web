import { Routes, Route } from "react-router-dom";
import ReservationPage from "./pages/reservations/ReservationPage";

function App() {
  return (
    <Routes location="/reservations">
      <Route path="/reservations" element={<ReservationPage />} />
    </Routes>
  );
}

export default App;
