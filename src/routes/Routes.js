import { Routes, Route } from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Home from "../pages/home/home";
import Dashboard from "../pages/myDashboard/dashboard";
import NotFound from "../pages/notFound/notFound";
import PrivateRoute from "./PrivateRoute";

import Profile from "../pages/profile/profile";
import RedirectIfAuthentication from "./RedirectIfAuthentication";
import FileManger from "../pages/filesManager/FileManger";
import UploadForm from "../pages/filesManager/UploadForm";
import Account from "../pages/myAccounts/Account";
import Connect from "../pages/myAccounts/Connect";
import ContactsList from "../pages/contactList/ContactsList";
import ContactsForm from "../pages/contactList/ContactForm";
import LinkedPlatforms from "../pages/platforms/LinkedPlatforms";
import Chain from "../pages/platforms/Chain";
import SingleMessaging from "../pages/singleMessaging/SingleMessaging";
import CreateSingleMessaging from "../pages/singleMessaging/CreateSingleMessaging";
import Groupessaging from "../pages/groupMessaging/GroupMessaging";
import GroupMessagingForm from "../pages/groupMessaging/GroupMessagingForm";
import AutoReplay from "../pages/autoReply/AutoReplay";
import Conversation from "../pages/conversation/Conversation";
import Subscription from "./../pages/subscriptionManager/Subscription";
import Reconnect from "../pages/myAccounts/Reconnect";
import AutoReplayForm from "../pages/autoReply/AutoReplayForm";
import SmartBot from "../pages/smartRobot/SmartBot";
import BotResponseCreator from "../pages/smartRobot/CreateSmartBot";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfAuthentication>
            <Home />
          </RedirectIfAuthentication>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthentication>
            <Register />
          </RedirectIfAuthentication>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuthentication>
            <Login />
          </RedirectIfAuthentication>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/file-management"
        element={
          <PrivateRoute>
            <FileManger />
          </PrivateRoute>
        }
      />

      <Route
        path="file-management/create"
        element={
          <PrivateRoute>
            <UploadForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/my-accounts"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />

      <Route
        path="my-accounts/connect"
        element={
          <PrivateRoute>
            <Connect />
          </PrivateRoute>
        }
      />

      <Route
        path="my-accounts/reconnect"
        element={
          <PrivateRoute>
            <Reconnect />
          </PrivateRoute>
        }
      />

      <Route
        path="/contact-list"
        element={
          <PrivateRoute>
            <ContactsList />
          </PrivateRoute>
        }
      />

      <Route
        path="contact-list/create"
        element={
          <PrivateRoute>
            <ContactsForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/linked-platforms"
        element={
          <PrivateRoute>
            <LinkedPlatforms />
          </PrivateRoute>
        }
      />

      <Route
        path="linked-platforms/chain"
        element={
          <PrivateRoute>
            <Chain />
          </PrivateRoute>
        }
      />

      <Route
        path="/individual-messaging"
        element={
          <PrivateRoute>
            <SingleMessaging />
          </PrivateRoute>
        }
      />

      <Route
        path="/individual-messaging/create"
        element={
          <PrivateRoute>
            <CreateSingleMessaging />
          </PrivateRoute>
        }
      />

      <Route
        path="/group-messaging"
        element={
          <PrivateRoute>
            <Groupessaging />
          </PrivateRoute>
        }
      />

      <Route
        path="/group-messaging/create"
        element={
          <PrivateRoute>
            <GroupMessagingForm />
          </PrivateRoute>
        }
      />
      {/* 
      <Route
        path="/auto-reply"
        element={
          <PrivateRoute>
            <AutoReplay />
          </PrivateRoute>
        }
      />

      <Route
        path="/auto-reply/create"
        element={
          <PrivateRoute>
            <AutoReplayForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/smart-bot"
        element={
          <PrivateRoute>
            <SmartBot />
          </PrivateRoute>
        }
      />

      <Route
        path="/smart-bot/create"
        element={
          <PrivateRoute>
            <BotResponseCreator />
          </PrivateRoute>
        }
      /> */}

      <Route
        path="/conversation/:id"
        element={
          <PrivateRoute>
            <Conversation />
          </PrivateRoute>
        }
      />

      <Route
        path="/subscription-manager"
        element={
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
