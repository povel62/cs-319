import Switch from "@mui/material/Switch"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import { DataGrid } from "@mui/x-data-grid"
import { momentFormatDate } from "../../utils/dateTimeFormat"
import InfoIcon from "@mui/icons-material/Info"
import { Div } from "../../components"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tooltip } from "@mui/material"
import Colors from "../../utils/colors"

const RulesTable = ({
  setWizardOpen,
  setWizardOpenMode,
  setWizardData,
  updateRuleStatus,
  deleteRule,
  isInactive,
  searchQuery,
  pageSize,
  setPageSize,
  setSortModel,
  sortModel,
}) => {
  const rules = useSelector((state) => state.Rules.rules) || []
  const ruleTypes = useSelector((state) => state.Rules.ruleTypes) || []
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
              String(rule.riskLevel)?.includes(term) ||
              (rule.ruleType.includes("SIZE") && "bytes".includes(term))
          )
        )
      }
    : (rules) => rules

  const isSystemRule = (ruleType) => {
    return (
      ruleType === "USERNAME_ITERATION" ||
      ruleType === "ASCII" ||
      ruleType === "BLACKLIST"
    )
  }
  const columns = [
    {
      field: "ruleType",
      headerClassName: "headerCell",
      headerName: "Type",
      renderCell: (cellValues) => {
        const ruleType = cellValues.row.ruleType
        const parameter = cellValues.row.parameter
        if (isSystemRule(ruleType)) {
          return (
            <Div center row>
              <p>{ruleType}</p>
              <Div width={8} />
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
                <InfoIcon sx={{ width: 20, height: 20, marginLeft: ".2rem" }} />
              </Tooltip>
            </Div>
          )
        }
        if (parameter !== "") {
          console.log(parameter)
          return ruleType + ` (${parameter})`
        }
        return ruleType
      },
      flex: 1,
    },
    {
      field: "name",
      headerName: "Field",
      flex: 1,
      renderCell: (cellValues) => {
        let val = cellValues.row.name
        if (cellValues.row.ruleType.includes("SIZE")) {
          val += " Bytes"
        }
        return (
          <p style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{val}</p>
        )
      },
    },
    {
      field: "riskLevel",
      headerName: "Risk Level",
      flex: 1,
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      type: "dateTime",
      valueGetter: ({ value }) => {
        return !value || value === "N/A"
          ? "N/A"
          : momentFormatDate(value, "MMM DD YYYY, h:mm A")
      },
      flex: 1,
    },
    {
      field: "enabled",
      sortable: false,
      width: 77,
      headerName: "Enabled",
      renderCell: (cellValues) => {
        return (
          <Switch
            sx={{ marginLeft: ".5rem" }}
            onClick={() => updateRuleStatus(cellValues.id, !isInactive)}
            checked={!isInactive}
            size="small"
            color="ternary"
          />
        )
      },
    },
    {
      field: "edit",
      sortable: false,
      width: 10,
      headerClassName: "headerCell",
      headerName: "Edit",
      renderCell: (cellValues) => {
        return (
          <IconButton
            aria-label="edit"
            color="secondary"
            onClick={() => {
              setWizardOpen(true)
              setWizardOpenMode("edit")
              setWizardData(cellValues.row)
            }}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
    {
      field: "delete",
      sortable: false,
      width: 65,
      headerName: "Delete",
      renderCell: (cellValues) => {
        return (
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => deleteRule(cellValues.id)}
            disabled={isSystemRule(cellValues.row.ruleType)}
          >
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]
  const rows = filterBySearch(rules)
    ?.filter((x) => x.inactive === isInactive)
    .map(
      (
        {
          ruleType,
          name,
          riskLevel,
          createdOn,
          updatedOn,
          id,
          inactive,
          parameter,
        },
        i
      ) => {
        let mostRecentlyUpdated = momentFormatDate(createdOn)
        if (updatedOn) {
          mostRecentlyUpdated = momentFormatDate(updatedOn)
        } else if (isSystemRule(ruleType)) {
          mostRecentlyUpdated = "N/A"
        }

        return {
          ruleType,
          name,
          riskLevel,
          lastUpdated: mostRecentlyUpdated,
          id,
          inactive,
          parameter,
        }
      }
    )

  return (
    <DataGrid
      sx={{
        "& .MuiDataGrid-columnHeaders": {
          color: Colors.theme_red,
          fontSize: 15,
        },
      }}
      disableSelectionOnClick
      disableColumnMenu
      disableColumnSelector
      autoHeight
      rows={rows || []}
      columns={columns}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => {
        setPageSize(newPageSize, isInactive)
      }}
      rowsPerPageOptions={[5, 10, 25, 50]}
      pagination
      sortingOrder={["asc", "desc"]}
      sortModel={sortModel}
      onSortModelChange={(newSortModel) =>
        setSortModel(newSortModel, isInactive)
      }
    />
  )
}

export default RulesTable
