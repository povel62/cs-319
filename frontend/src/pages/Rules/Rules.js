import React, { useEffect, useState } from "react"
import { Typography, Button, Paper, Box, Tooltip } from "@mui/material"
import axios from "axios"
import PageWrapper from "../../components/PageWrapper"
import Colors from "../../utils/colors"
import Backdrop from "@mui/material/Backdrop"
import CircularProgress from "@mui/material/CircularProgress"
import InfoIcon from "@mui/icons-material/Info"
import Fade from "@mui/material/Fade"
import Divider from "@mui/material/Divider"
import SearchBar from "../../components/SearchBar"
import { useDispatch, useSelector } from "react-redux"
import { fetchRules, fetchRuleTypes } from "../../redux/reducers/rulesSlice"
import RulesTable from "./RulesTable"
import RuleWizard from "./RuleWizard"
import RiskThresholds from "./RiskThresholds"
import { Div } from "../../components"

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
        <Typography variant="h6">{name}</Typography>
        <Divider sx={{ marginTop: ".4rem" }} />
        <Div h="1vh" />
        <Box sx={{ padding: ".3rem 1rem" }} display="flex" flexGrow={1}>
          {children}
        </Box>
      </Div>
    </Paper>
  )
}

const Rules = (props) => {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const isRulesLoading = useSelector((state) => state.Rules.isLoading)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [wizardOpenMode, setWizardOpenMode] = useState("create")
  const [wizardData, setWizardData] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const ruleTypes = useSelector((state) => state.Rules.ruleTypes) || []
  const [thresholds, setThresholds] = useState([0.33, 0.66])
  const [activeRulesTablePageSize, setActiveRulesTablePageSize] = useState(5)
  const [inactiveRulesTablePageSize, setInactiveRulesTablePageSize] =
    useState(5)
  const [activeRulesTableSortModel, setActiveRulesTableSortModel] = useState([
    {
      field: "lastUpdated",
      sort: "desc",
    },
  ])
  const [inactiveRulesTableSortModel, setInactiveRulesTableSortModel] =
    useState([
      {
        field: "lastUpdated",
        sort: "desc",
      },
    ])
  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value)
  }

  const loadLocalStoragePreferencesInState = () => {
    const rowsPerPageActiveRulesTable = localStorage.getItem(
      "rowsPerPageActiveRulesTable"
    )
    const rowsPerPageInactiveRulesTable = localStorage.getItem(
      "rowsPerPageInactiveRulesTable"
    )
    const sortOrderActiveRulesTable = localStorage.getItem(
      "sortOrderActiveRulesTable"
    )
    const sortPropertyActiveRulesTable = localStorage.getItem(
      "sortPropertyActiveRulesTable"
    )
    const sortOrderInactiveRulesTable = localStorage.getItem(
      "sortOrderInactiveRulesTable"
    )
    const sortPropertyInactiveRulesTable = localStorage.getItem(
      "sortPropertyInactiveRulesTable"
    )
    sortOrderActiveRulesTable !== null &&
      sortPropertyActiveRulesTable !== null &&
      setActiveRulesTableSortModel([
        {
          field: sortPropertyActiveRulesTable,
          sort: sortOrderActiveRulesTable,
        },
      ])

    sortOrderInactiveRulesTable !== null &&
      sortPropertyInactiveRulesTable !== null &&
      setInactiveRulesTableSortModel([
        {
          field: sortPropertyInactiveRulesTable,
          sort: sortOrderInactiveRulesTable,
        },
      ])

    rowsPerPageActiveRulesTable !== null &&
      setActiveRulesTablePageSize(parseInt(rowsPerPageActiveRulesTable, 10))

    rowsPerPageInactiveRulesTable !== null &&
      setInactiveRulesTablePageSize(parseInt(rowsPerPageInactiveRulesTable, 10))
  }

  useEffect(() => {
    getSystemConfig()
    dispatch(fetchRuleTypes())
    dispatch(fetchRules())
    loadLocalStoragePreferencesInState()
  }, [])

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
  const updateRuleStatus = (id, isInActive) => {
    setIsLoading(true)
    axios
      .post(`/api/rule/${id}/is-inactive/${isInActive}`)
      .then((response) => {
        props.openSnackbarWithMessage({
          status: true,
          response: `Rule has been ${
            isInActive ? "deactivated" : "activated"
          } successfully`,
        })
        setIsLoading(false)
        dispatch(fetchRules())
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
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
        props.openSnackbarWithMessage({
          status: true,
          response: "Rule has been deleted successfully",
        })
        setIsLoading(false)
        dispatch(fetchRules())
      })
      .catch((error) => {
        props.openSnackbarWithMessage({
          status: false,
          response: "The rule could not be deleted",
        })
        setIsLoading(false)
        console.log(error)
      })
  }

  const handlePageSizeChange = (pageSize, isInactiveTable) => {
    if (isInactiveTable) {
      setInactiveRulesTablePageSize(pageSize)
      localStorage.setItem("rowsPerPageInactiveRulesTable", pageSize)
    } else {
      setActiveRulesTablePageSize(pageSize)
      localStorage.setItem("rowsPerPageActiveRulesTable", pageSize)
    }
  }

  const handleSortChange = (sortModel, isInactiveTable) => {
    if (isInactiveTable) {
      setInactiveRulesTableSortModel(sortModel)
      localStorage.setItem("sortOrderInactiveRulesTable", sortModel[0]["sort"])
      localStorage.setItem(
        "sortPropertyInactiveRulesTable",
        sortModel[0]["field"]
      )
    } else {
      setActiveRulesTableSortModel(sortModel)
      localStorage.setItem("sortOrderActiveRulesTable", sortModel[0]["sort"])
      localStorage.setItem(
        "sortPropertyActiveRulesTable",
        sortModel[0]["field"]
      )
    }
  }

  return (
    <PageWrapper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isRulesLoading || isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <RuleWizard
        ruleTypes={ruleTypes}
        open={wizardOpen}
        mode={wizardOpenMode}
        data={wizardData}
        handleClose={() => setWizardOpen(false)}
        getRules={fetchRules}
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
            <Tooltip
              placement="bottom-start"
              color="primary"
              title={`Rules are the filters upon which emails will be evaluated.
              They inspect various parts of an email and are triggered upon violation.
              Only rules that are marked as active will be used to evaluate emails.
              System rules (marked by SYSTEM under fields) are special rules that can only be enabled or disabled. They come prepackaged and can be enabled if the behavior is desired. 
              Risk level measures how dangerous an email is. It spans from 0 - 1 with a higher risk level meaning a higher threat.
              Risk thresholds determine what action will be taken based on the email’s risk level.
              Clean: The email will be forwarded to the receiver.
              Suspicious: The email will be flagged as having potentially dangerous material and will be forwarded to the receiver.
              Quarantined: The email will be flagged as dangerous and will NOT be forwarded to the receiver`
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
            </Tooltip>
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center">
            <Box sx={{ width: "25rem" }}>
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
          <RulesTable
            setWizardOpen={setWizardOpen}
            setWizardOpenMode={setWizardOpenMode}
            setWizardData={setWizardData}
            isInactive={false}
            searchQuery={searchQuery}
            updateRuleStatus={updateRuleStatus}
            deleteRule={deleteRule}
            setResponseMessage={props.openSnackbarWithMessage}
            pageSize={activeRulesTablePageSize}
            setPageSize={handlePageSizeChange}
            sortModel={activeRulesTableSortModel}
            setSortModel={handleSortChange}
          />
        </Ruleset>
        <Div h={16} />
        <Ruleset name="Inactive Rules" type="inactive">
          <RulesTable
            setWizardOpen={setWizardOpen}
            setWizardOpenMode={setWizardOpenMode}
            setWizardData={setWizardData}
            isInactive={true}
            searchQuery={searchQuery}
            updateRuleStatus={updateRuleStatus}
            deleteRule={deleteRule}
            setResponseMessage={props.openSnackbarWithMessage}
            pageSize={inactiveRulesTablePageSize}
            setPageSize={handlePageSizeChange}
            sortModel={inactiveRulesTableSortModel}
            setSortModel={handleSortChange}
          />
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
