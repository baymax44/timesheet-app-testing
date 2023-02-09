import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomDropdown from "../components/CustomDropdown";
import ProjectList from "../components/ProjectList";
import { useDispatch, useSelector } from "react-redux";
import {
  saveProjectData,
  selectProjectData,
  selectUserData,
} from "../redux/appReducer";

const Admin = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const projectData = useSelector(selectProjectData);

  const [projectDatas, setProjectDatas] = useState([]);
  const [dropdownProjectDatas, setProjectDropDownDatas] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [gSelectedProjectId, setGSelectedProjectId] = useState("");
  const [entriesId, setEntriesId] = useState("");
  const tempEntries = [];

  useEffect(() => {
    if (userData) {
      getAllProjects();
    }
  }, [userData]);

  useEffect(() => {
    if (projectData && projectData.projects) {
      projectData.projects.map((project, key) => {
        tempDropdownProjectsData.push({
          _id: project._id,
          value: project._id,
          name: project.projectName,
        });
        setProjectDropDownDatas(tempDropdownProjectsData);
      });
    }
    setTasksPerProject(gSelectedProjectId);
    setEntriesPerTask(entriesId);
  }, [projectData]);

  const tempData = [];

  const columns = ["No", "Task Name", "Total hours", "Status"];

  const tempDropdownProjectsData = [];

  const setTasksPerProject = (selectedProjectId) => {
    if (selectedProjectId !== "") {
      let selectedProject = projectData.projects.map((project, key) =>
        project._id == selectedProjectId ? project : ""
      );

      for (const project of projectData.projects) {
        if (project._id == selectedProjectId) {
          selectedProject = project;
        }
      }

      let status = "PENDING";
      
      selectedProject.tasks.map((task, key0) => {
        let totalhours = 0;
        task.entries.map((entry, key1) => {
          totalhours += entry.duration;
        });

        tempData.push({
          projectname: task.taskName,
          totalhours: totalhours,
          status: status,
          _id: task._id,
        });
      });

      setProjectDatas(tempData);
    }
  };

  const setEntriesPerTask = (task_id) => {
    if (task_id !== "") {
      let selectedProject = projectData.projects.map((project, key) =>
        project._id == gSelectedProjectId ? project : ""
      );

      for (const project of projectData.projects) {
        if (project._id == gSelectedProjectId) {
          selectedProject = project;
        }
      }

      for (const task of selectedProject.tasks) {
        if (task._id == task_id) {
          task.entries.map((entry, key1) => {
            tempEntries.push(entry);
          });

          setSelectedEntries(tempEntries);
        }
      }
    }
  };

  const getAllProjects = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/project/getAllProjects")
      .then((response) => {
        dispatch(saveProjectData({ data: response.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSelectValueChangeHandler = (event) => {
    let selectedProjectId = event.target.value;
    setTasksPerProject(selectedProjectId);
    setGSelectedProjectId(selectedProjectId);
  };

  const onSelectTaskHandler = (task_id) => {
    setEntriesPerTask(task_id);
    setEntriesId(task_id);
  };

  const setInitProjectId = (projectId) => {
    setTasksPerProject(projectId);
    setGSelectedProjectId(projectId);
  };

  return (
    <>
      <div className="mb-4 mt-4">
        <CustomDropdown
          datas={dropdownProjectDatas}
          onSelectValueChangeHandler={onSelectValueChangeHandler}
          setInitProjectId={setInitProjectId}
          styling={"w-full ml-0"}
        />
      </div>
      <ProjectList
        tasks={projectDatas}
        columns={columns}
        pagename="project"
        onSelectTaskHandler={onSelectTaskHandler}
        contents={selectedEntries}
        contents_type="entries"
      />
    </>
  );
};

export default Admin;
