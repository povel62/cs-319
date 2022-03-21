import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Div from "../../components/Div";
import Typography from "@mui/material/Typography";
import Graphs from "./Graphs";
import TopStats from "./TopStats";
import BottomStats from "./BottomStats";
import PageWrapper from "../../components/PageWrapper";
import { fetchEmails } from "../../redux/reducers/quarantinedEmailsSlice";
import { fetchRules } from "../../redux/reducers/rulesSlice";
import { Backdrop, CircularProgress } from "@mui/material";

const Dashboard = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmails());
    dispatch(fetchRules());
  }, [dispatch, props.isNewEmail]);

  const isRulesLoading = useSelector((state) => state.Rules.isLoading);
  const isEmailsLoading = useSelector(
    (state) => state.quarantinedEmails.isLoading
  );

  return (
    <PageWrapper>
      {isRulesLoading || isEmailsLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isRulesLoading || isEmailsLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Div ph={24} fill mb={24}>
          <Div row mt={16} mb={24}>
            <Typography variant="h6">Overview</Typography>
          </Div>
          <TopStats />
          <Div h={24} />
          <Graphs />
          <Div h={24} />
          <BottomStats />
        </Div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
