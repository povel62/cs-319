import React, { useEffect, useState } from "react"
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
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material"
import axios from "axios"
import Div from "../components/Div"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import PageWrapper from "../components/PageWrapper"
import Colors from "../utils/colors"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import InfoIcon from "@mui/icons-material/Info"
import Fade from "@mui/material/Fade"
import InputLabel from "@mui/material/InputLabel"
import { momentFormatDate } from "../utils/dateTimeFormat"
import Divider from "@mui/material/Divider"
import QuarantinedEmailsSearchBarHeader from "../components/Quarantine/QuarantinedEmailsSearchBarHeader"
import SearchBar from "../components/SearchBar"
import { useDispatch, useSelector } from "react-redux"
import { fetchRuleTypes } from "../redux/reducers/rulesSlice"

const ruleTypeToConfig = {
  KEYWORD: {
    display_name: "Keyword Match",
    textfields: [{ name: "Text", type: "text" }],
  },
  DOMAIN: {
    display_name: "Domain Match",
    textfields: [{ name: "Text", type: "text" }],
  },
  FREQUENCY: {
    display_name: "Frequency",
    textfields: [{ name: "Text", type: "text" }],
  },
  SIZE: {
    display_name: "Size",
    textfields: [{ name: "Size", type: "naturalNumber" }],
  },
  NO_OF_ATTACHMENTS: {
    display_name: "Number of Attachments",
    textfields: [{ name: "Number Of Attachments", type: "naturalNumber" }],
  },
  ATTACHMENT_SIZE: {
    display_name: "Attachment Size",
    textfields: [{ name: "Size", type: "naturalNumber" }],
  },
  ATTACHMENT_NAME: {
    display_name: "Attachment Name",
    textfields: [{ name: "Text", type: "text" }],
  },
  // USERNAME_ITERATION: { display_name: "Username Iteration", textfields: [] },
}

const ColumnNames = () => {
  return (
    <Grid
      container
      sx={{
        borderBottom: `solid 1px ${Colors.theme_red_light}`,
        padding: "0 1rem 0.5rem 1rem",
      }}
    >
      <Grid item xs={3}>
        <Typography variant="h6">Type</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="h6">Field</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">Risk Level</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="h6">Created</Typography>
      </Grid>
    </Grid>
  )
}

const RuleWizard = ({
  ruleTypes,
  open,
  handleClose,
  getRules,
  thresholds,
  setResponseMessage,
  mode,
  data,
}) => {
  const [name, setName] = useState("")
  const [ruleType, setRuleType] = useState("")
  const [riskLevel, setRiskLevel] = useState(0.5)
  const [isInactive, setIsInactive] = useState(true)
  const [parameter, setParameter] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isEditMode = mode === "edit"
  useEffect(() => {
    if (isEditMode) {
      setName(data.name)
      setParameter(data.parameter)
      setRuleType(data.ruleType)
      setRiskLevel(data.riskLevel)
      setIsInactive(data.inactive)
    } else {
      setName("")
      setParameter("")
      setRuleType("")
      setRiskLevel(0.5)
      setIsInactive(true)
    }
  }, [open, mode])

  const createRule = () => {
    setIsLoading(true)

    if (!name || (!parameter && ruleType === "FREQUENCY")) {
      setResponseMessage({
        status: false,
        response: "Name or Parameter cannot be blank",
      })
      setIsLoading(false)
      return
    }

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
        })
        setIsLoading(false)
        getRules()
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The rule could not be created",
        })
        setIsLoading(false)
        console.log(error)
      })
  }

  const editRule = () => {
    setIsLoading(true)
    axios
      .post(`/api/rule/${data.id}/risk-level`, {
        riskLevel,
      })
      .then((response) => {
        setResponseMessage({
          status: true,
          response: "Rule: " + name + " was edited sucessfully",
        })
        setIsLoading(false)
        getRules()
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The rule could not be edited",
        })
        setIsLoading(false)
        console.log(error)
      })
  }
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
  ]

  const selectedRuleTypeConfig = ruleTypeToConfig[ruleType]

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
            disabled={isEditMode}
            value={ruleType || ""}
            onChange={(e) => {
              setRuleType(e.target.value)
              setName("")
              setIsInactive(true)
              setParameter("")
            }}
          >
            {ruleTypes.map((ruleType, i) => {
              return (
                ruleTypeToConfig[ruleType.name] && (
                  <MenuItem key={i} value={ruleType.name}>
                    <Box width="100%" height="100%">
                      <Tooltip
                        placement="right"
                        title={
                          ruleTypes
                            .find((x) => x.name === ruleType.name)
                            ?.description.split("\n")
                            .map((s, i) => <p key={i}>{s}</p>) ||
                          "Choose the type of rule first"
                        }
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 0 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>
                            {ruleTypeToConfig[ruleType.name]?.display_name ||
                              ""}
                          </Typography>
                          <InfoIcon
                            color="fillColor"
                            sx={{ width: 20, height: 20 }}
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  </MenuItem>
                )
              )
            })}
          </Select>
        </Div>
        {selectedRuleTypeConfig?.textfields?.map((textfield, i) => (
          <Div key={i} pv="2vh" row alignItemsCenter justifyContentBetween>
            <DialogContentText>{textfield.name + ":"} </DialogContentText>
            <TextField
              disabled={isEditMode}
              variant="standard"
              size="small"
              value={name}
              onChange={(e) => {
                if (
                  textfield.type === "naturalNumber" &&
                  !/^([0-9])*$/.test(e.target.value)
                ) {
                  return
                }
                setName(e.target.value)
              }}
              InputProps={{
                inputProps: {
                  style: { textAlign: "center" },
                },
              }}
            />
          </Div>
        ))}

        {ruleType === "FREQUENCY" && (
          <Div pv="2vh" row alignItemsCenter justifyContentBetween>
            <DialogContentText>Frequency: </DialogContentText>
            <TextField
              disabled={isEditMode}
              variant="standard"
              size="small"
              value={parameter}
              onChange={(e) => {
                ;/^([0-9])*$/.test(e.target.value) &&
                  setParameter(e.target.value)
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
                setRiskLevel(e.target.value)
              }}
              sx={{
                ".MuiSlider-rail": {
                  height: "1vh",
                  background: `linear-gradient(to right, ${
                    Colors.theme_green
                  } ${thresholds[0] * 100}%, ${Colors.theme_orange}99 ${
                    thresholds[0] * 100
                  }% ${thresholds[1] * 100}%, ${Colors.theme_red}99 ${
                    thresholds[1] * 100
                  }%);`,
                },
              }}
            />
          </Div>
        </Div>
        <Div pv="1vh">
          <Div row alignItemsCenter justifyContentBetween>
            <DialogContentText>{`Status: ${
              isInactive ? "Disabled" : "Enabled"
            }`}</DialogContentText>
            <Switch
              disabled={isEditMode}
              onChange={(e) => {
                setIsInactive(!e.target.checked)
              }}
            />
          </Div>
        </Div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (isEditMode) {
              editRule()
            } else {
              createRule()
            }
            handleClose()
          }}
          autoFocus
        >
          {mode === "edit" ? "Edit" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const Rule = ({
  id,
  name,
  ruleType,
  riskLevel,
  created,
  active,
  getRules,
  setResponseMessage,
  editRule,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const ruleTypes = useSelector((state) => state.Rules.ruleTypes) || []

  const updateRuleStatus = (id, isInActive) => {
    setIsLoading(true)
    axios
      .post(`/api/rule/${id}/is-inactive/${isInActive}`)
      .then((response) => {
        setResponseMessage({
          status: true,
          response: `Rule has been ${
            isInActive ? "deactivated" : "activated"
          } successfully`,
        })
        setIsLoading(false)
        getRules()
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The update was unsuccessful",
        })
        setIsLoading(false)
      })
  }

  const deleteRule = (id) => {
    setIsLoading(true)
    axios
      .delete(`/api/rule/${id}`)
      .then((response) => {
        setResponseMessage({
          status: true,
          response: "Rule has been deleted successfully",
        })
        setIsLoading(false)
        getRules()
      })
      .catch((error) => {
        setResponseMessage({
          status: false,
          response: "The rule could not be deleted",
        })
        setIsLoading(false)
        console.log(error)
      })
  }

  return (
    <Box
      sx={{
        borderBottom: `solid 1px ${Colors.theme_red_light}`,
        padding: ".1rem 1rem",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography>{ruleType}</Typography>
            <Box width={4} />

            {(ruleType === "USERNAME_ITERATION" || ruleType === "ASCII") && (
              <Div center>
                <Tooltip
                  color="fillColor"
                  placement="right"
                  title={ruleTypes
                    ?.find((x) => x.name === ruleType)
                    ?.description.split("\n")
                    .map((s, i) => (
                      <p key={i}>{s}</p>
                    ))}
                >
                  <InfoIcon sx={{ width: 20, height: 20 }} />
                </Tooltip>
              </Div>
            )}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Typography>{`${name} ${
            ruleType.includes("SIZE") ? "Bytes" : ""
          }`}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{riskLevel}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>
            {ruleType === "USERNAME_ITERATION" || ruleType === "ASCII"
              ? "N/A"
              : momentFormatDate(created, "MMM DD YYYY, h:mm A")}
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
              onClick={() => editRule()}
            >
              <EditIcon />
            </IconButton>
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
    </Box>
  )
}

const Ruleset = ({ name, children, type }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: `${
          type === "inactive" ? Colors.black + "07" : "white"
        }`,
      }}
    >
      <Div m={24}>
        <Typography variant="h5">{name}</Typography>
        <Divider sx={{ marginTop: ".4rem" }} />
        <Div h="1vh" />
        <Box sx={{ padding: "0 1rem" }}>
          <ColumnNames />
          {children}
        </Box>
      </Div>
    </Paper>
  )
}

const RiskThresholds = ({ thresholdsParent, saveThresholds }) => {
  const [thresholds, setThresholds] = useState(thresholdsParent)

  useEffect(() => {
    setThresholds(thresholdsParent)
  }, [thresholdsParent])

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
  ]

  return (
    <Paper variant="outlined">
      <Div m="1vw">
        <Typography variant="h5" sx={{ paddingBottom: ".5rem" }}>
          Risk Thresholds
        </Typography>
        <Divider />
        <Div h={32} />
        <Div ph={8}>
          <Div pb={16}>
            <Slider
              value={thresholds}
              onChange={(event, newThresholds, activeThumb) => {
                if (!Array.isArray(newThresholds)) {
                  return
                }

                const minDistance = 0.01

                if (activeThumb === 0) {
                  setThresholds([
                    Math.min(newThresholds[0], thresholds[1] - minDistance),
                    thresholds[1],
                  ])
                } else {
                  setThresholds([
                    thresholds[0],
                    Math.max(newThresholds[1], thresholds[0] + minDistance),
                  ])
                }
              }}
              marks={marks}
              min={0}
              max={1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                let level = ""
                if (value === thresholds[0]) {
                  level = "Suspicious"
                } else {
                  level = "Quarantine"
                }
                return level + " If Risk > " + value
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
                    Colors.theme_green
                  } ${thresholds[0] * 100}%, ${Colors.theme_orange}99 ${
                    thresholds[0] * 100
                  }% ${thresholds[1] * 100}%, ${Colors.theme_red}99 ${
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
  )
}

const Rules = (props) => {
  const [thresholds, setThresholds] = useState([0.33, 0.66])
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardOpenMode, setWizardOpenMode] = useState("create")
  const [wizardData, setWizardData] = useState({})
  const [rules, setRules] = useState([])
  const [ruleTypes, setRuleTypes] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }

  const filterBySearch = searchQuery
    ? (rules) => {
        const formattedQuery = searchQuery.toLowerCase()
        const terms = formattedQuery.split(" ")
        return rules.filter((rule) =>
          terms.every(
            (term) =>
              rule.name?.toLowerCase().includes(term) ||
              rule.ruleType?.toLowerCase().includes(term) ||
              rule.parameter?.toLowerCase().includes(term) ||
              (rule.ruleType.includes("SIZE") && "bytes".includes(term))
          )
        )
      }
    : (rules) => rules

  useEffect(() => {
    getRules()
    getRuleTypes()
    getSystemConfig()
    dispatch(fetchRuleTypes())
  }, [])

  const getRules = () => {
    setIsLoading(true)
    axios
      .get(`/api/rule`)
      .then((response) => {
        setRules(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "Rules could not be retreived",
        })
        console.log(error)
        setIsLoading(false)
      })
  }

  const getRuleTypes = () => {
    setIsLoading(true)
    axios
      .get(`/api/rule/types`)
      .then((response) => {
        setRuleTypes(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "Rule Types could not be retreived",
        })
        console.log(error)
        setIsLoading(false)
      })
  }

  const getSystemConfig = () => {
    setIsLoading(true)
    axios
      .get(`/api/system-config`)
      .then((response) => {
        if (response.data.length > 0) {
          setThresholds(
            JSON.parse(response.data.find((x) => x.name === "thresholds").value)
          )
        }
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "System Configuration could not be retreived",
        })
        console.log(error)
        setIsLoading(false)
      })
  }

  const saveThresholds = (thresholds) => {
    setIsLoading(true)
    axios
      .post(`/api/system-config`, {
        name: "thresholds",
        value: JSON.stringify(thresholds),
      })
      .then((response) => {
        props.openSnackbarWithMessage({
          status: true,
          response: "Thresholds have been set successfully",
        })
        setIsLoading(false)
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "Thresholds could not be saved",
        })
        console.log(error)
        setIsLoading(false)
      })
  }

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
    },
  })

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
        ruleTypes={ruleTypes}
        open={wizardOpen}
        mode={wizardOpenMode}
        data={wizardData}
        handleClose={() => setWizardOpen(false)}
        getRules={getRules}
        thresholds={thresholds}
        setResponseMessage={props.openSnackbarWithMessage}
      />
      <Div mh={24} fill mb={24} mt={16}>
        <Box
          mb={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Manage Rules</Typography>
            <Box width={8} />
            <CustomWidthTooltip
              placement="bottom-start"
              color="primary"
              title={`Rules are the filters upon which emails will be evaluated. 
              
              They inspect various parts of an email and are triggered upon violation. 
              
              Only rules that are marked as active will be used to evaluate emails. 

              Risk level measures how dangerous an email is. It spans from 0 - 1 with a higher risk level meaning a higher threat. 
              
              Risk thresholds determine what action will be taken based on the email’s risk level. 
              Clean: The email will be forwarded to the receiver.
              Suspicious: The email will be flagged as having potentially dangerous material and will be forwarded to the receiver.
              Quarantined: The email will be flagged as dangerous and will NOT be forwarded to the receiver.`
                .split("\n")
                .map((s, i) => (
                  <React.Fragment key={i}>
                    <Typography key={i}>{s}</Typography>
                    <p></p>
                  </React.Fragment>
                ))}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 300 }}
            >
              <InfoIcon sx={{ width: 20, height: 20 }} />
            </CustomWidthTooltip>
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center">
            <Box>
              <SearchBar
                searchQuery={searchQuery}
                handleSearchQuery={handleSearchQuery}
              />
            </Box>

            <Box width={16} />
            <Button
              variant="contained"
              onClick={() => {
                setWizardOpen(true)
                setWizardOpenMode("create")
              }}
            >
              Add Rule
            </Button>
          </Box>
        </Box>
        <Ruleset name="Active Rules">
          {filterBySearch(rules)
            .filter((x) => !x.inactive)
            .map((activeRule, i) => (
              <Rule
                key={i}
                id={activeRule.id}
                name={activeRule.name}
                ruleType={
                  activeRule.ruleType +
                  (activeRule.ruleType === "FREQUENCY"
                    ? ` (${activeRule.parameter})`
                    : "")
                }
                riskLevel={activeRule.riskLevel}
                created={activeRule.createdOn}
                active
                getRules={getRules}
                setResponseMessage={props.openSnackbarWithMessage}
                editRule={() => {
                  setWizardOpen(true)
                  setWizardOpenMode("edit")
                  setWizardData(activeRule)
                }}
              />
            ))}
        </Ruleset>
        <Div h={16} />
        <Ruleset name="Inactive Rules" type="inactive">
          {filterBySearch(rules)
            .filter((x) => x.inactive)
            .map((inactiveRule, i) => (
              <Rule
                key={i}
                id={inactiveRule.id}
                name={inactiveRule.name}
                ruleType={
                  inactiveRule.ruleType +
                  (inactiveRule.ruleType === "FREQUENCY"
                    ? ` (${inactiveRule.parameter})`
                    : "")
                }
                riskLevel={inactiveRule.riskLevel}
                created={inactiveRule.createdOn}
                getRules={getRules}
                setResponseMessage={props.openSnackbarWithMessage}
                editRule={() => {
                  setWizardOpen(true)
                  setWizardOpenMode("edit")
                  setWizardData(inactiveRule)
                }}
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
  )
}

export default Rules
