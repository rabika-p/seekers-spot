import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPsw from "./pages/ForgotPsw";
import ResetPsw from "./pages/ResetPsw";
import NotFound from "./components/NotFound";
import AddLostItem from "./pages/AddLostItem";
import SideBarLayout from "./components/SideBarLayout";
import GuestLayout from "./GuestLayout";
import Dashboard from "./pages/Dashboard";
import ItemsListing from "./pages/ItemsListing";
import ItemDetails from "./pages/ItemDetails";
import UserItems from "./pages/UserItems";
import EditLostItem from "./pages/EditLostItem";
import AddFoundItem from "./pages/AddFoundItem";
import EditFoundItem from "./pages/EditFoundItem";
import UserMatches from "./pages/UserMatches";

function App() {
    return (
    <div>
      <Router>
        <div>
          <div>
            <Routes>

              <Route path="/" element={<GuestLayout> <Signin /> </GuestLayout>}></Route>
              <Route path="/signup" element={<GuestLayout> <Signup /> </GuestLayout>}></Route>
              <Route path="/forgot-password" element={<GuestLayout><ForgotPsw /></GuestLayout>} />
              <Route path="/reset-password" element={<GuestLayout><ResetPsw /></GuestLayout>} />

              <Route path="/dashboard" element={<SideBarLayout><Dashboard /></SideBarLayout>}></Route>

              <Route path="/add-lost-item" element={<SideBarLayout> <AddLostItem /></SideBarLayout>}></Route>
              <Route path="/edit-lost-item/:itemId" element={<SideBarLayout> <EditLostItem /></SideBarLayout>}></Route>
              <Route path="/lost-items-listing" element={<SideBarLayout> <ItemsListing itemType="lost" /></SideBarLayout>}></Route>
              <Route path="/lost-item/:id" element={<SideBarLayout> <ItemDetails itemType="lost" /></SideBarLayout>}></Route>
              <Route path="/my-lost-items" element={<SideBarLayout> <UserItems itemType="lost" /></SideBarLayout>}></Route>
              <Route path="/my-lost-item-claims" element={<SideBarLayout> <UserMatches itemType="lost" /></SideBarLayout>}></Route>

              <Route path="/add-found-item" element={<SideBarLayout> <AddFoundItem /></SideBarLayout>}></Route>
              <Route path="/edit-found-item/:itemId" element={<SideBarLayout> <EditFoundItem /></SideBarLayout>}></Route>
              <Route path="/found-items-listing" element={<SideBarLayout> <ItemsListing itemType="found" /></SideBarLayout>}></Route>
              <Route path="/found-item/:id" element={<SideBarLayout> <ItemDetails itemType="found" /></SideBarLayout>}></Route>
              <Route path="/my-found-items" element={<SideBarLayout> <UserItems itemType="found" /></SideBarLayout>}></Route>
              <Route path="/my-found-item-claims" element={<SideBarLayout> <UserMatches itemType="found" /></SideBarLayout>}></Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
