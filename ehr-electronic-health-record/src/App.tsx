import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppLayout from "./layouts/AppLayout"
import LibraryPage from "./pages/LibraryPage"
import PlaceholderPage from "./pages/PlaceholderPage"
import ProvideVitals from "./pages/ProvideVitals"
import SettingsPage from "./pages/SettingsPage"
import UserDashboardPage from "./pages/UserDashboardPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ProvideVitals />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="search" element={<PlaceholderPage title="Search" />} />
          <Route path="images" element={<PlaceholderPage title="Images" />} />
          <Route path="compose" element={<LibraryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
