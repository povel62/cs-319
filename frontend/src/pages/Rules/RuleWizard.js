import React, { useEffect, useState } from "react"
import {
  Typography,
  Button,
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
} from "@mui/material"
import axios from "axios"
import Colors from "../../utils/colors"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import InfoIcon from "@mui/icons-material/Info"
import Fade from "@mui/material/Fade"

import { useDispatch, useSelector } from "react-redux"
import { fetchRules, fetchRuleTypes } from "../../redux/reducers/rulesSlice"

import { Div } from "../../components"
const ruleTypeToConfig = {
  KEYWORD: {
    display_name: "Keyword Match",
    textfields: [
      { name: "Text", type: "text", placeholder: "Please enter some text" },
    ],
  },
  DOMAIN: {
    display_name: "Domain Match",
    textfields: [
      { name: "Text", type: "text", placeholder: "Please enter some text" },
    ],
  },
  FREQUENCY: {
    display_name: "Frequency",
    textfields: [
      { name: "Text", type: "text", placeholder: "Please enter some text" },
    ],
  },
  SIZE: {
    display_name: "Size",
    textfields: [
      {
        name: "Size",
        type: "naturalNumber",
        placeholder: "Please enter a number",
      },
    ],
  },
  NO_OF_ATTACHMENTS: {
    display_name: "Number of Attachments",
    textfields: [
      {
        name: "Number Of Attachments",
        type: "naturalNumber",
        placeholder: "Please enter a number",
      },
    ],
  },
  ATTACHMENT_SIZE: {
    display_name: "Attachment Size",
    textfields: [
      {
        name: "Size",
        type: "naturalNumber",
        placeholder: "Please enter a number",
      },
    ],
  },
  ATTACHMENT_NAME: {
    display_name: "Attachment Name",
    textfields: [
      { name: "Text", type: "text", placeholder: "Please enter some text" },
    ],
  },
  // USERNAME_ITERATION: { display_name: "Username Iteration", textfields: [] },
}
const RuleWizard = ({
  open,
  handleClose,
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

  const dispatch = useDispatch()

  const ruleTypes = useSelector((state) => state.Rules.ruleTypes) || []
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
        response: "Rule parameters cannot be blank",
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
          response:
            'Rule: "' + ruleType + ": " + name + '" was created sucessfully',
        })
        setIsLoading(false)
        dispatch(fetchRules())
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
          response:
            'Rule: "' + ruleType + ": " + name + '" was edited sucessfully',
        })
        setIsLoading(false)
        dispatch(fetchRules())
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
          <DialogContentText sx={{ color: isEditMode ? "lightgray" : "black" }}>
            Select Rule Type:
          </DialogContentText>

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
                ((ruleTypeToConfig[ruleType.name] &&
                  ruleType.name != "SYSTEM") ||
                  isEditMode) && (
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
            <DialogContentText
              sx={{ color: isEditMode ? "lightgray" : "black" }}
            >
              {textfield.name + ":"}{" "}
            </DialogContentText>
            <TextField
              disabled={isEditMode}
              variant="standard"
              placeholder={textfield.placeholder}
              sx={{ width: "15rem" }}
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
                  style: { textAlign: "left", paddingLeft: ".7rem" },
                },
              }}
            />
          </Div>
        ))}

        {ruleType === "FREQUENCY" && (
          <Div pv="2vh" row alignItemsCenter justifyContentBetween>
            <DialogContentText
              sx={{ color: isEditMode ? "lightgray" : "black" }}
            >
              Frequency:{" "}
            </DialogContentText>
            <TextField
              disabled={isEditMode}
              variant="standard"
              sx={{ width: "15rem" }}
              placeholder="Please enter a number"
              value={parameter}
              onChange={(e) => {
                ;/^([0-9])*$/.test(e.target.value) &&
                  setParameter(e.target.value)
              }}
              InputProps={{
                inputProps: {
                  style: { textAlign: "left", paddingLeft: ".7rem" },
                },
              }}
            />
          </Div>
        )}
        <Div pv="1vh">
          <DialogContentText sx={{ color: "black" }}>
            Risk Level:
          </DialogContentText>
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
            <DialogContentText
              sx={{ color: isEditMode ? "lightgray" : "black" }}
            >{`Status: ${
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

export default RuleWizard
