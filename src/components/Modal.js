import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import {
  closeModal,
  selectEntryId,
  selectModalFlag,
  selectProjectData,
  selectUserData,
  selectModalType,
  selectSelectProjectId,
  selectSelectTaskId,
  selectSelectEntryDate,
  selectSelectComment,
  selectSelectDuration,
} from "../redux/appReducer";
import CustomDropdown from "./CustomDropdown";

// method - add, edit,
const Modal = () => {
  const modalFlag = useSelector(selectModalFlag);
  const modalType = useSelector(selectModalType);

  const dispatch = useDispatch();
  const entryId = useSelector(selectEntryId);
  const projectData = useSelector(selectProjectData);
  const [dropdownProjectDatas, setProjectDropDownDatas] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [gSelectedProjectId, setGSelectedProjectId] = useState("");
  const [projectDatas, setProjectDatas] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState([]);
  const [comment, setComment] = useState("");
  const [duration, setDuration] = useState("");
  const userData = useSelector(selectUserData);
  const tempDropdownProjectsData = [];
  const tempData = [];

  const selectProjectId = useSelector(selectSelectProjectId);
  const selectTaskId = useSelector(selectSelectTaskId);
  const selectEntryDate = useSelector(selectSelectEntryDate);
  const selectComment = useSelector(selectSelectComment);
  const selectDuration = useSelector(selectSelectDuration);

  const navigate = useNavigate();

  useEffect(() => {

    projectData.projects &&
      projectData.projects.map((project, key) => {
        tempDropdownProjectsData.push({
          _id: project._id,
          value: project._id,
          name: project.projectName,
        });
        setProjectDropDownDatas(tempDropdownProjectsData);
      });
  }, [modalFlag]);
  const getEntryDataById = () => {
    projectData.projects &&
      projectData.projects.map((project, key) => {
        tempDropdownProjectsData.push({
          _id: project._id,
          value: project._id,
          name: project.projectName,
        });
        setProjectDropDownDatas(tempDropdownProjectsData);
      });
  };

  const setTasksPerProject = (selectedProjectId) => {
    let selectedProject = projectData.projects.map((project, key) =>
      project._id == selectedProjectId ? project : ""
    );

    for (const project of projectData.projects) {
      if (project._id == selectedProjectId) {
        selectedProject = project;
      }
    }

    let totalhours = 0;
    let status = "PENDING";

    selectedProject.tasks.map((task, key0) => {
      task.entries.map((entry, key1) => {
        totalhours += entry.duration;
      });

      tempData.push({
        name: task.taskName,
        value: task._id,
        _id: task._id,
      });
    });

    setProjectDatas(tempData);
  };

  const onSelectValueChangeHandler = (event) => {
    let selectedProjectId = event.target.value;
    setTasksPerProject(selectedProjectId);
    setGSelectedProjectId(selectedProjectId);
  };

  useEffect(() => {
    // alert("entryID", entryId)
    if (entryId != "") {
      getEntryDataById();
    }
  }, [entryId]);

  // if(entryId != '') {
  //   getEntryDataById();
  // }

  const clickCloseBtn = () => {
    dispatch(closeModal());
  };

  const onClickEdit = () => {
    // selectedProjectId
    // selectedTaskId
    // comment
    // duration
    if (modalType == "Edit")
      axios
        .post(process.env.REACT_APP_API_URL + "/project/updateEntry", {
          entryId: entryId,
          userId: userData._id,
          comment: comment,
          duration: duration,
          regDate: selectEntryDate
        })
        .then((res) => {
          clickCloseBtn();
          navigate("/");
        })
        .catch((err) => {
          clickCloseBtn();
        });
    else
      axios
        .put(process.env.REACT_APP_API_URL + "/project/addEntry", {
          taskId: selectedTaskId,
          userId: userData._id,
          comment: comment,
          duration: duration,
          regDate: selectEntryDate,
        })
        .then((res) => {
          clickCloseBtn();
          navigate("/");
        })
        .catch((err) => {
          clickCloseBtn();
        });
  };

  const setInitProjectId = (projectId) => {
    setTasksPerProject(projectId);
    setGSelectedProjectId(projectId);
  };

  const setInitTaskId = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const onTaskValueChangeHandler = (event) => {
    let selectedTaskId = event.target.value;

    setSelectedTaskId(selectedTaskId);
  };

  return (
    <>
      {modalFlag && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 bg-[#94a3b8CC] left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex"
        >
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                onClick={() => clickCloseBtn()}
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                  {`${modalType} Entry`}
                </h3>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="w-full block mb-1 text-sm font-medium text-gray-600">
                      Project Name
                    </label>
                    <CustomDropdown
                      datas={dropdownProjectDatas}
                      onSelectValueChangeHandler={onSelectValueChangeHandler}
                      setInitProjectId={setInitProjectId}
                      defaultValue={selectProjectId}
                      styling={"w-full ml-0"}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                      Task Name
                    </label>
                    <CustomDropdown
                      datas={projectDatas}
                      onSelectValueChangeHandler={onTaskValueChangeHandler}
                      setInitProjectId={setInitTaskId}
                      defaultValue={selectTaskId}
                      styling={"w-full ml-0"}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="">
                      <label className="block mb-1 text-sm font-medium text-gray-600">
                        Comment
                      </label>
                      <textarea
                        rows={5}
                        onChange={(e) => setComment(e.target.value)}
                        defaultValue={modalType == "Edit" ? selectComment: ''}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="">
                      <label className="block mb-1 text-sm font-medium text-gray-600">
                        Duration
                      </label>
                      <input
                        type={"number"}
                        onChange={(e) => setDuration(e.target.value)}
                        defaultValue={modalType == "Edit" ? selectDuration: ''}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    className="w-fit text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() => onClickEdit()}
                  >
                    {modalType === "Add" ? "Add entry" : "Edit entry"}
                  </button>
                  <button
                    className="w-fit text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ml-4"
                    onClick={() => clickCloseBtn()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
