import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Adduser from "./components/Adduser";
import Layout from "./components/Layout";
import TeamsPage from "./pages/teams/TeamsPage";
import ClientPage from "./pages/clients/ClientPage";
import Projectpage from "./pages/projects/Projectpage";
import PDFExtractor from "./pages/pdfextractor/PDFExtractor";
import FinderPage from "./pages/finder/FinderPage";
import ReportsPage from "./pages/reports/ReportsPage";
import Diagnoses from "./pages/diagnoses/Diagnoses";
import ActiveLogs from "./pages/activitylogs/ActiveLogs";
import NotificationPage from "./pages/notification/NotificationPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/adduser" element={<Adduser />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/project" element={<Projectpage />} />
            <Route path="/pdfextractor" element={<PDFExtractor />} />
            <Route path="/finder" element={<FinderPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/diagnoses" element={<Diagnoses />} />
            <Route path="/activitylogs" element={<ActiveLogs />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
