import Navbar from "./pages/navbar";
import Home from "./pages/home";
import Event from "./pages/events";
import Footer from "./pages/footer";
import Contact from "./pages/contact";
import SignIn from "./pages/signin";
import Login from "./pages/login";
import ResetPassword from "./pages/Resetpassword";
import ManageEvents from "./admin/manageEvents";
import CreateEvent from "./admin/createEvent";
import Report from "./admin/report";
import AdminPanel from "./admin/AdminPanel";
import CustomerProfile from "../customer/CustomerProfile";
import EditEvent from "./admin/EditEvent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />
                <main className="p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/events" element={<Event />} />
                        <Route path="/contact" element={<Contact/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/signin" element={<SignIn/>} />
                        <Route path="/Resetpassword" element={<ResetPassword />} />
                        <Route path="/manageEvents" element={<ManageEvents />} />
                        <Route path="/createEvent" element={<CreateEvent />} />
                        <Route path="/EditEvent/:id" element={<EditEvent />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/AdminPanel" element={<AdminPanel />} />
                        <Route path="/CustomerProfile" element={<CustomerProfile />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}
export default App;