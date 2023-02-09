import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectList from "../components/ProjectList";

import {
  getMyTasks,
  getProductsWithDate,
  selectCurStartEndDate,
  selectProjects,
  selectSelectEntryDate,
  selectSelectProjectId,
  selectUserData,
  selectViewType,
} from "../redux/appReducer";
import SelectButton from "../components/ButtonGroup";
import { getDaysBetweenFromTo, getMonthFromTo, getWeekFromTo } from "../util";

const Time = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const projects = useSelector(selectProjects);
  const viewType = useSelector(selectViewType);
  const selectEntryDate = useSelector(selectSelectEntryDate);

  const [sortProjects, setSortProjects] = useState([]);
  const [content, setContent] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const [projectDatas, setProjectDatas] = useState([]);

  const curStartEndDate = useSelector(selectCurStartEndDate);

  const columns = ["No", "Date", "Project/Task", "Total hours", "Status"];

  useEffect(() => {
    if (!userData.user) {
      if (viewType === "Weekly") {
        let { from, to } = getWeekFromTo();
        dispatch(
          getProductsWithDate({
            userId: userData._id,
            fromDate: from,
            toDate: to,
          })
        );
      } else {
        let { from, to } = getMonthFromTo();
        dispatch(
          getProductsWithDate({
            userId: userData._id,
            fromDate: from,
            toDate: to,
          })
        );
      }
    }
  }, [viewType]);

  useEffect(() => {
    if (!userData.user) {
      let { from, to } = getWeekFromTo();
      dispatch(
        getProductsWithDate({
          userId: userData._id,
          fromDate: from,
          toDate: to,
        })
      );
    }
  }, [userData]);

  useEffect(() => {
    dispatch(getMyTasks(userData._id));
  }, []);
  const dateSequence = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const setListProject = (curSEDate) => {
    var daysBetweenFromTo = 0;
      let disableflag = true;
    var from = "",
      to = "";
    if (viewType == "Weekly") {
      from = curSEDate ? curSEDate.startdate : getWeekFromTo().from;
      to = curSEDate ? curSEDate.enddate : getWeekFromTo().to;
    } else {
      from = curSEDate ? curSEDate.startdate : getMonthFromTo().from;
      to = curSEDate ? curSEDate.enddate : getMonthFromTo().to;
    }
    daysBetweenFromTo = getDaysBetweenFromTo(from, to);
    var temp = [];
    var dates = dateSequence(from, to);
    for (var i = 0, k = 0, addFlag = false; i < daysBetweenFromTo; i++) {
      var entriesTemp = [];
      while (projects[k] && projects[k].regDate.slice(0, 10) === dates[i]) {
        entriesTemp.push(projects[k]);
        k++;
        addFlag = true;
      }
      var sumDuration = 0;
      var statusFlag = "";
      for (const entry of entriesTemp) {
        sumDuration += entry.duration;
        if (entry.status === "PENDING") statusFlag = "PENDING";
          if (entry.status === "REJECT") statusFlag = "REJECT";
          if (entry.status === "NONE") statusFlag = "";
      }

        if (!addFlag){
          temp.push({
            _id: i,
            date: dates[i],
            entries: [],
            duration: 0,
            status: "",
            projectId: 0,
          });
        }
        else{
          if(statusFlag !== "PENDING")
            disableflag = false;
          temp.push({
            _id: i,
            date: dates[i],
            entries: entriesTemp,
            duration: sumDuration,
            status: statusFlag,
            projectId: entriesTemp[0].projectId,
          });
        }
        addFlag = false;
      }

    setSortProjects(temp);
    var projectListDataTemp = [];
    temp.map((item) => {
      projectListDataTemp.push({
        date: item.date,
        projectName: item.entries.length
          ? `${item.entries[0].projectName} / ${item.entries[0].taskName} (${item.entries.length})`
          : "",
        duration: item.duration,
        status: item.status,
        _id: item._id,
        projectId: item.projectId,
        taskId: item.taskId,
      });
    });
    setProjectDatas(projectListDataTemp);
      setDisableSubmit(disableflag);
  }

  useEffect(() => {

    setListProject(curStartEndDate)
      
  }, [projects, curStartEndDate, viewType]);

  const onSelectTaskHandler = (id) => {
    setContent(sortProjects[id].entries);
  };

  return (
    <>
      <SelectButton />
      <ProjectList
        tasks={projectDatas}
        columns={columns}
        onSelectTaskHandler={onSelectTaskHandler}
        contents={content}
        contents_type="entries"
        pagename="time"
        disableSubmit={disableSubmit}
      />
    </>
  );
};

export default Time;
