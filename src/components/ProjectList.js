import axios from "axios";
import { useEffect, useState, Fragment, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  changeModalType,
  saveSelectComment,
  saveSelectDuration,
  saveSelectEntryDate,
  saveSelectProjectId,
  saveSelectProjectNo,
  saveSelectTaskId,
  selectDrawerStatus,
  selectSelectProjectNo,
  setDrawerStatus,
  showModal,
} from "../redux/appReducer";
import { saveProjectData } from "../redux/appReducer";
import { Dialog, Transition } from "@headlessui/react";
import Modal from "./Modal";
import {
  ExclamationTriangleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  setEntryIdToEdit,
  selectUserData,
  selectViewType,
  getProductsWithDate,
  selectCurStartEndDate,
} from "../redux/appReducer";
import { getMonthFromTo, getWeekFromTo } from "../util";

export default function ProjectList({
  tasks,
  columns,
  tasksname,
  onSelectTaskHandler,
  contents,
  contents_type,
  projectId,
  pagename,
  disableSubmit
}) {
  const drawerStatus = useSelector(selectDrawerStatus);
  const selectProjectNo = useSelector(selectSelectProjectNo);
  const userData = useSelector(selectUserData);
  const viewType = useSelector(selectViewType);
  const curStartEndDate = useSelector(selectCurStartEndDate);

  const [rightDrawerStatus, setRightDrawerStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [tempEntryId, setTempEntryId] = useState("");
  const [tempStatus, setTempStatus] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [feedback, setFeedback] = useState("");

  const cancelButtonRef = useRef(null);
  const dispatch = useDispatch();

  const clickEditBtn = (content) => {
    dispatch(showModal());
    dispatch(changeModalType({ data: "Edit" }));
    dispatch(saveSelectTaskId({ data: content.taskId }));
    dispatch(saveSelectProjectId({ data: content.projectId }));
    dispatch(saveSelectComment(content.comment));
    dispatch(saveSelectDuration(content.duration))
    console.log('---------------->',content)

    if (content.entryId) {
      // alert("dispatch entry_id to store" + content.entryId)

      dispatch(setEntryIdToEdit(content.entryId)); // save entry_id to store
    }
  };

  useEffect(() => {
    if (pagename == "time" && tasks.length && tasks[selectProjectNo])
      onSelectTaskHandler(selectProjectNo);
  }, [tasks]);

  useEffect(() => {
    setRightDrawerStatus(drawerStatus);
  }, []);

  const openConfirm = (entryId, status) => () => {
    if(status === "Submit Entries" && disableSubmit){
      return;
    }

    if (status === "Submit Entries") {
      setTitle("Submit " + viewType + " for approval.");
      setDesc("Are you going to approve " + viewType + " entries");
    } else if (status === "APPROVE") {
      setTitle("Approve Entry");
      setDesc("Please confirm approve entry");
    } else {
      setTitle("Reject Entry");
      setDesc("Please confirm reject entry");
    }
    
    setTempEntryId(entryId);
    setTempStatus(status);
    setOpen(true);
  };

  const submitApproval = () => {
    let from, to;

    if (viewType == "Weekly") {
      from = curStartEndDate ? curStartEndDate.startdate : getWeekFromTo().from;
      to = curStartEndDate ? curStartEndDate.enddate : getWeekFromTo().to;
    } else {
      from = curStartEndDate ? curStartEndDate.startdate : getMonthFromTo().from;
      to = curStartEndDate ? curStartEndDate.enddate : getMonthFromTo().to;
    }

    axios
      .post(process.env.REACT_APP_API_URL + "/project/setStatusPending", {
        userId: userData._id,
        fromDate: from,
        toDate: to,
      })
      .then((response) => {
        setOpen(false);
        if (response.data.success)
          dispatch(
            getProductsWithDate({
              userId: userData._id,
              fromDate: from,
              toDate: to,
            })
          );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickEntry = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/project/changeEntryStatus", {
        userId: userData._id,
        entryId: tempEntryId,
        status: tempStatus,
        feedback: feedback
      })
      .then((response) => {
        if (response.data.success)
          axios
            .get(process.env.REACT_APP_API_URL + "/project/getAllProjects")
            .then((res) => {
              dispatch(saveProjectData({ data: res.data }));
              setOpen(false);
              setFeedback('');
            })
            .catch((err) => {
              console.log(err);
            });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addEntry = () => {
    dispatch(changeModalType({ data: "Add" }));
    dispatch(showModal());
  };

  return (
    <div className="project-list flex justify-between">
      <Modal />
      <div
        className={`transition-[width] pr-3 ${
          rightDrawerStatus ? "w-[60%]" : "w-[100%]"
        }`}
      >
        <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-3">
          <thead className="text-xs text-white uppercase border-b border-[#475569] dark:text-white">
            <tr>
              {columns.map((item, key) => {
                return (
                  <th key={key} scope="col" className="px-6 py-3 text-center">
                    {item}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tasks && tasks.length === 0 && (
              <tr>
                <td className="px-6 py-3 text-center">
                  <p>No pojects yet!</p>
                </td>
              </tr>
            )}
            {tasks &&
              tasks.map((project, key) => (
                <tr
                  key={key}
                  className="border-b border-[#475569] hover:bg-[#2d3a4f] cursor-pointer"
                  onClick={() => {
                    setRightDrawerStatus(true);
                    dispatch(setDrawerStatus(true));
                    onSelectTaskHandler(project._id);
                    dispatch(saveSelectProjectNo(key));
                    dispatch(saveSelectEntryDate(project.date));
                  }}
                >
                  <td className="px-6 py-4 text-center">{key + 1}</td>
                  {pagename == "time"
                    ? Object.values(project).map((projobj1, key1) => {
                        return key1 != Object.values(project).length - 2 &&
                          key1 != Object.values(project).length - 3 ? (
                          <td key={key1} className="px-6 py-4 text-center">
                            {projobj1}
                          </td>
                        ) : (
                          ""
                        );
                      })
                    : Object.values(project).map((projobj1, key1) => {
                        if (key1 === Object.values(project).length - 2) {
                          return (
                            <td key={key1} className="px-6 py-4 text-center">
                              {project.status === "PENDING" ? (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                  PENDING
                                </span>
                              ) : project.status === "APPROVE" ? (
                                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                  APPROVED
                                </span>
                              ) : project.status === "REJECT" ? (
                                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                  REJECTED
                                </span>
                              ) : (
                                ""
                              )}
                            </td>
                          );
                        }

                        return key1 != Object.values(project).length - 1 ? (
                          <td key={key1} className="px-6 py-4 text-center">
                            {projobj1}
                          </td>
                        ) : (
                          ""
                        );
                      })}
                </tr>
              ))}
          </tbody>
        </table>

        {pagename === "time" && (
          <button
            type="button"
            disabled={disableSubmit}
            className={disableSubmit ? 
              "mt-8 float-right inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md"
              :"mt-8 float-right inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out"
            }
            onClick={openConfirm("", "Submit Entries")}
          >
            Submit {viewType === "Weekly" ? "Weekly" : "Monthly"} For Approval
          </button>
        )}
      </div>

      <div
        className={`border border-[#475569] h-[100%] transition-[width] ${
          rightDrawerStatus ? "block w-[39%]" : "hidden w-[0%]"
        } `}
      >
        <div className="h-[40px] border-b border-[#475569] items-center justify-end px-3">
          {/* Push Right Button */}
          <div className="w-full p-1 h-fit rounded-[50%] transition-all cursor-pointer flex justify-between items-center">
            {
              userData.role === "USER" && pagename == "time" ? 
              <button 
                type="button"
                className="bg-white text-gray-600 px-4 py-1 ml-5 text-sm font-medium border rounded border-gray-600 hover:shadow hover:bg-gray-500 hover:text-white"
                onClick={() => addEntry()}
              >
                Add Entry
              </button>
              :
              <p className="text-white">Detail View</p>
            }

            <XMarkIcon
              className="text-white text-xs w-6 h-6 hover:text-gray-500"
              onClick={() => {
                setRightDrawerStatus(false);
                dispatch(setDrawerStatus(false));
              }}
            />
          </div>
          <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100 mt-3">
              <thead>
                <tr>
                  {contents_type === "entries" ? (
                    <>
                      <th scope="col" className="px-6 py-3 text-center">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Comment
                      </th>
                      {userData.role === "ADMIN" && (
                        <th scope="col" className="px-6 py-3 text-center">
                          User
                        </th>
                      )}
                      {(userData.role === "ADMIN" || pagename == "time") &&(
                            <th
                              scope="col"
                              className="px-6 py-3 text-center"
                            >
                              Action
                            </th>
                      )}

                    </>
                  ) : (
                    ""
                  )}
                </tr>
              </thead>
              <tbody className="">
                {contents &&
                  contents.map((content, key) => (
                    <tr
                      key={key}
                      className="border-b border-[#475569] hover:bg-[#2d3a4f] cursor-pointer"
                      onClick={() => {
                        setRightDrawerStatus(true);
                        dispatch(setDrawerStatus(true));
                      }}
                    >
                      {contents_type === "entries" ? (
                        <>
                          <td className="px-6 py-4 text-center">
                            {/* {content} */}
                            {content.regDate != null && content.regDate != undefined ? content.regDate.slice(0, 10) : '' }
                          </td>
                          <td className="px-6 py-4 text-center">{content.duration}</td>
                          <td className="px-6 py-4 text-center">
                            {content.status === "PENDING" ? (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                PENDING
                              </span>
                            ) : content.status === "APPROVE" ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                Approved
                              </span>
                            ) : content.status === "REJECT" ? (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                REJECTED
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">{content.comment}</td>
                          {userData.role === "ADMIN" && (
                            <td className="px-6 py-4 text-center">
                              {content.userId.email}
                            </td>
                          )}
                          {userData.role === "USER" && pagename == "time" && (
                            <td
                              className="px-6 py-4 text-green-300 text-center"
                            >
                              <button
                                type="button"
                                disabled={content.status === "APPROVE"}
                                className={content.status === "APPROVE" ? 
                                    "bg-gray text-gray-600 px-4 py-1 ml-5 text-sm font-medium border rounded border-gray-600"
                                    :"bg-white text-gray-600 px-4 py-1 ml-5 text-sm font-medium border rounded border-gray-600 hover:shadow hover:bg-gray-500 hover:text-white"
                                  }
                                onClick={() => clickEditBtn(content)}
                              >
                                Edit
                              </button>
                            </td>
                          )}
                          {
                            userData.role === "ADMIN" &&
                              <td
                                className="px-6 py-4 text-green-300 flex text-center"
                              >
                                <button
                                  type="button"
                                  disabled={content.status === "APPROVE" || content.status === "REJECT"}
                                  className={content.status === "APPROVE" || content.status === "REJECT" ? 
                                      "text-gray-600 px-4 py-1 text-sm ml-5 font-medium border rounded border-green-500"
                                      :"bg-green-500 text-white px-4 py-1 text-sm ml-5 font-medium border rounded border-green-500 hover:shadow hover:bg-gray-500 "
                                    }
                                  onClick={openConfirm(content._id, "APPROVE")}
                                >
                                  Approve
                                </button>                                  
                                <button
                                  type="button"
                                  disabled={content.status === "REJECT"}
                                  className={content.status === "REJECT" ? 
                                  "text-gray-600 px-4 py-1 text-sm ml-5 font-medium border rounded border-red-500"
                                  :"bg-red-500 text-white px-4 py-1 text-sm ml-5 font-medium border rounded border-red-500 hover:shadow hover:bg-gray-500 "
                                    }
                                  onClick={openConfirm(content._id, "REJECT")}
                                >
                                  Reject
                                </button>
                              </td>
                            }
                        </>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      {tempStatus === "APPROVE" ? (
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                          <CheckIcon
                            className="h-6 w-6 text-green-600"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                        {
                          tempStatus !== "Submit Entries" &&
                          <div className="mt-2">
                            <input
                              onChange={(e) => setFeedback(e.target.value)}
                              className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={
                        tempStatus == "APPROVE"
                          ? "inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-s"
                          : "inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-s"
                      }
                      onClick={
                        tempStatus == "Submit Entries"
                          ? submitApproval
                          : clickEntry
                      }
                    >
                      {tempStatus}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
