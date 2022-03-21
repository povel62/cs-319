import { Routes, Route } from "react-router-dom";
import { Dashboard, Login, Quarantine, Rules } from "../pages";

const Router = (props) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            openSnackbarWithMessage={props.openSnackbarWithMessage}
            isNewEmail={props.isNewEmail}
          />
        }
      />
      <Route
        path="/login"
        element={
          <Login openSnackbarWithMessage={props.openSnackbarWithMessage} />
        }
      />
      <Route
        path="/rules"
        element={
          <Rules
            openSnackbarWithMessage={props.openSnackbarWithMessage}
            isNewEmail={props.isNewEmail}
          />
        }
      />
      <Route
        path="/quarantine"
        element={
          <Quarantine
            openSnackbarWithMessage={props.openSnackbarWithMessage}
            isNewEmail={props.isNewEmail}
          />
        }
      />
    </Routes>
  );
};

export default Router;
