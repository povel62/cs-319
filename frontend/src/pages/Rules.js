import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Slider,
  Switch,
  Select,
  MenuItem,
  TextField,
  fabClasses,
} from "@mui/material";
import axios from "axios";
import Div from "../components/Div";
import DeleteIcon from "@mui/icons-material/Delete";
import PageWrapper from "../components/PageWrapper";
import Colors from "../utils/colors";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const ColumnNames = () => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography variant="h6">name</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">type</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">risk level</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">created</Typography>
      </Grid>
    </Grid>
  );
};

const RuleWizard = ({
  open,
  handleClose,
  getRules,
  thresholds,
  setResponseMessage,
}) => {
  const [name, setName] = useState("");
  const [ruleType, setRuleType] = useState("");
  const [riskLevel, setRiskLevel] = useState(0.5);
  const [isInactive, setIsInactive] = useState(true);
  const [parameter, setParameter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName("");
    setParameter("");
    setRuleType("");
    setRiskLevel(0.5);
    setIsInactive(false);
  }, [open]);

  const createRule = () => {
    setIsLoading(true);
    axios
      .post(`/api/rule`, {
        name,
        ruleType,
        riskLevel,
        isInactive,
        parameter: ruleType === "FREQUENCY" ? parameter : "",
      })
      .then((response) => {
        setResponseMessage({
          status: true,
          response: "Rule: " + name + " was created sucessfully",
        });
        setIsLoading(false);
        getRules();
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The rule could not be created",
        });
        setIsLoading(false);
        console.log(error);
      });
  };

  const riskLevels = [
    {
      value: 0,
      label: "Safe",
    },
    {
      value: 0.3,
      label: "Low",
    },
    {
      value: 0.5,
      label: "Medium",
    },
    {
      value: 0.8,
      label: "High",
    },
    {
      value: 1,
      label: "Dangerous",
    },
  ];
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle>Rule Wizard</DialogTitle>
      <DialogContent>
        <Div pv="1vh">
          <DialogContentText>Select Rule Type</DialogContentText>
          <Select
            value={ruleType}
            lable="Rule Type"
            onChange={(e) => setRuleType(e.target.value)}
          >
            <MenuItem value="KEYWORD">Keyword Match</MenuItem>
            <MenuItem value="DOMAIN">Domain Match</MenuItem>
            <MenuItem value="FREQUENCY">Frequency</MenuItem>
            <MenuItem value="SIZE">Size</MenuItem>
            <MenuItem value="NO_OF_ATTACHMENTS">Number of Attachments</MenuItem>
            <MenuItem value="ATTACHMENT_SIZE">Attachment Size</MenuItem>
            <MenuItem value="ATTACHMENT_NAME">Attachment Name</MenuItem>
          </Select>
        </Div>
        <Div pv="2vh" row alignItemsCenter justifyContentBetween>
          <DialogContentText>Text: </DialogContentText>
          <TextField
            variant="standard"
            size="small"
            onChange={(e) => {
              setName(e.target.value);
            }}
            InputProps={{
              inputProps: {
                style: { textAlign: "center" },
              },
            }}
          />
        </Div>
        {ruleType === "FREQUENCY" && (
          <Div pv="2vh" row alignItemsCenter justifyContentBetween>
            <DialogContentText>Frequency: </DialogContentText>
            <TextField
              variant="standard"
              size="small"
              onChange={(e) => {
                setParameter(e.target.value);
              }}
              InputProps={{
                inputProps: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </Div>
        )}
        <Div pv="1vh">
          <DialogContentText>Risk Level: </DialogContentText>
          <Div pv="2vh" ph="3vw">
            <Slider
              marks={riskLevels}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              defaultValue={riskLevel}
              step={0.01}
              onChange={(e) => {
                setRiskLevel(e.target.value);
              }}
              sx={{
                ".MuiSlider-rail": {
                  height: "1vh",
                  background: `linear-gradient(to right, ${
                    Colors.theme_yellow
                  } ${thresholds[0] * 100}%, ${Colors.theme_orange} ${
                    thresholds[0] * 100
                  }% ${thresholds[1] * 100}%, ${Colors.theme_red} ${
                    thresholds[1] * 100
                  }%);`,
                },
              }}
            />
          </Div>
        </Div>
        <Div pv="1vh">
          <Div row alignItemsCenter justifyContentBetween>
            <DialogContentText>Status: </DialogContentText>
            <Switch
              onChange={(e) => {
                setIsInactive(!e.target.checked);
              }}
            />
          </Div>
        </Div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            createRule();
            handleClose();
          }}
          autoFocus
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Rule = ({
  id,
  name,
  ruleType,
  riskLevel,
  created,
  active,
  getRules,
  setResponseMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateRuleStatus = (id, isInActive) => {
    setIsLoading(true);
    axios
      .post(`/api/rule/${id}/is-inactive/${isInActive}`)
      .then((response) => {
        setResponseMessage({
          status: true,
          response: `Rule has been ${
            isInActive ? "deactivated" : "activated"
          } successfully`,
        });
        setIsLoading(false);
        getRules();
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The update was unsuccessful",
        });
        setIsLoading(false);
      });
  };

  const deleteRule = (id) => {
    setIsLoading(true);
    axios
      .delete(`/api/rule/${id}`)
      .then((response) => {
        setResponseMessage({
          status: true,
          response: "Rule has been deleted successfully",
        });
        setIsLoading(false);
        getRules();
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The rule could not be deleted",
        });
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <Typography>{name}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{ruleType}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{riskLevel}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>
            {new Date(created)
              .toISOString()
              .slice(0, 19)
              .replace(/-/g, "/")
              .replace("T", " ")}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button variant="text" onClick={() => updateRuleStatus(id, active)}>
            <Typography>{active ? "disable" : "enable"}</Typography>
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="right">
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => deleteRule(id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const Ruleset = ({ name, children }) => {
  return (
    <Paper variant="outlined">
      <Div m={24}>
        <Typography variant="h5">{name}</Typography>
        <Div h="1vh" />
        <ColumnNames />
        {children}
      </Div>
    </Paper>
  );
};

const RiskThresholds = ({ thresholdsParent, saveThresholds }) => {
  const [thresholds, setThresholds] = useState(thresholdsParent);

  useEffect(() => {
    setThresholds(thresholdsParent);
  }, [thresholdsParent]);

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
  ];

  return (
    <Paper variant="outlined">
      <Div m="2vw">
        <Typography variant="h5">Risk Thresholds</Typography>
        <Div h={16} />
        <Div ph={8}>
          <Div pb={16}>
            <Slider
              value={thresholds}
              onChange={(event, newThresholds, activeThumb) => {
                if (!Array.isArray(newThresholds)) {
                  return;
                }

                const minDistance = 0.01;

                if (activeThumb === 0) {
                  setThresholds([
                    Math.min(newThresholds[0], thresholds[1] - minDistance),
                    thresholds[1],
                  ]);
                } else {
                  setThresholds([
                    thresholds[0],
                    Math.max(newThresholds[1], thresholds[0] + minDistance),
                  ]);
                }
              }}
              marks={marks}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                let level = "";
                if (value === thresholds[0]) {
                  level = "Suspicious";
                } else {
                  level = "Quarantine";
                }
                return level + " If Risk < " + value;
              }}
              step={0.01}
              disableSwap
              track={false}
              sx={{
                ".MuiSlider-markLabel": {
                  paddingTop: "1vh",
                },
                ".MuiSlider-mark": {
                  background: `rgba(0,0,0,0)`,
                },
                ".MuiSlider-rail": {
                  height: "1vh",
                  background: `linear-gradient(to right, ${
                    Colors.theme_yellow
                  } ${thresholds[0] * 100}%, ${Colors.theme_orange} ${
                    thresholds[0] * 100
                  }% ${thresholds[1] * 100}%, ${Colors.theme_red} ${
                    thresholds[1] * 100
                  }%);`,
                },
                ".MuiSlider-thumb": {
                  height: "4vh",
                  width: "2px",
                  borderRadius: "0px",
                  background: `grey`,
                },
              }}
            />
          </Div>
          <Grid container>
            <Grid item xs={4}>
              <Typography>{`Clean: 0 - ${thresholds[0].toFixed(
                2
              )}`}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign="center">
                {`Suspicious: ${thresholds[0].toFixed(
                  2
                )} - ${thresholds[1].toFixed(2)} `}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography textAlign="right">
                {`Quarantined: ${thresholds[1].toFixed(2)} - 1`}
              </Typography>
            </Grid>
          </Grid>
        </Div>
        <Div h="2vh" />
        <Div center>
          <Button
            variant="contained"
            onClick={() => saveThresholds(thresholds)}
          >
            Save
          </Button>
        </Div>
      </Div>
    </Paper>
  );
};

const Rules = (props) => {
  const [thresholds, setThresholds] = useState([0.33, 0.66]);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRules();
    getSystemConfig();
  }, []);

  const getRules = () => {
    setIsLoading(true);
    axios
      .get(`/api/rule`)
      .then((response) => {
        setRules(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "Rules could not be retreived",
        });
        console.log(error);
        setIsLoading(false);
      });
  };

  const getSystemConfig = () => {
    setIsLoading(true);
    axios
      .get(`/api/system-config`)
      .then((response) => {
        if (response.data.length > 0) {
          setThresholds(
            JSON.parse(response.data.find((x) => x.name === "thresholds").value)
          );
        }
        setIsLoading(false);
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "System Configuration could not be retreived",
        });
        console.log(error);
        setIsLoading(false);
      });
  };

  const saveThresholds = (thresholds) => {
    setIsLoading(true);
    axios
      .post(`/api/system-config`, {
        name: "thresholds",
        value: JSON.stringify(thresholds),
      })
      .then((response) => {
        props.openSnackbarWithMessage({
          status: true,
          response: "Thresholds have been set successfully",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "Thresholds could not be saved",
        });
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <PageWrapper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <RuleWizard
        open={wizardOpen}
        handleClose={() => setWizardOpen(false)}
        getRules={getRules}
        thresholds={thresholds}
        setResponseMessage={props.openSnackbarWithMessage}
      />
      <Div mh={24} fill mb={24} mt={16}>
        <Div mb={16} justifyContentBetween row alignItemsCenter>
          <Div>
            <Typography variant="h6">Manage Rules</Typography>
          </Div>
          <Div>
            <Button variant="contained" onClick={() => setWizardOpen(true)}>
              Add Rule
            </Button>
          </Div>
        </Div>
        <Ruleset name="Active Rules">
          {rules
            .filter((x) => !x.inactive)
            .map((activeRule, i) => (
              <Rule
                key={i}
                id={activeRule.id}
                name={activeRule.name}
                ruleType={activeRule.ruleType}
                riskLevel={activeRule.riskLevel}
                created={activeRule.createdOn}
                active
                getRules={getRules}
                setResponseMessage={props.openSnackbarWithMessage}
              />
            ))}
        </Ruleset>
        <Div h={16} />
        <Ruleset name="Inactive Rules">
          {rules
            .filter((x) => x.inactive)
            .map((inactiveRule, i) => (
              <Rule
                key={i}
                id={inactiveRule.id}
                name={inactiveRule.name}
                ruleType={inactiveRule.ruleType}
                riskLevel={inactiveRule.riskLevel}
                created={inactiveRule.createdOn}
                getRules={getRules}
                setResponseMessage={props.openSnackbarWithMessage}
              />
            ))}
        </Ruleset>
        <Div h={16} />
        <RiskThresholds
          thresholdsParent={thresholds}
          saveThresholds={saveThresholds}
        />
      </Div>
    </PageWrapper>
  );
};

export default Rules;
