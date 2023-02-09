import { createSlice } from "@reduxjs/toolkit";
import { projectService } from "../services/projects";
import { userService } from "../services/users";
import { formatDate, getMonthStartEnd, getWeekFromTo, getWeekStartEnd } from "../util";

export const appSlice = createSlice({
  name: "snackBar",
  initialState: {
    logined: false,
    modalFlag: false,
    modalType: "",
    userData: {},
    projects: [],
    viewType: "Weekly",
    projectData: {},
    entryId: "",
    myTasks: [],

    currentDate: '',
    curStartEndDate: null,
    selectProjectId: "",
    selectTaskId: "",
    selectProjectNo: 0,
    selectEntryDate:formatDate(new Date()),
    selectComment:'',
    selectDuration:0,
    drawerStatus: false,
  },
  reducers: {
    saveSelectProjectId: (state, action) => {
      state.selectProjectId = action.payload.data;
    },
    saveSelectProjectNo: (state, action) => {
      state.selectProjectNo = action.payload;
    },
    saveSelectComment:(state, action) => {
      state.selectComment = action.payload;
    },
    saveSelectDuration:(state, action) => {
      state.selectDuration = action.payload;
    },
    saveSelectEntryDate:(state, action) => {
      state.selectEntryDate = action.payload;
    },
    setCurStartEndDate: (state, action) => {
      state.curStartEndDate = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload.data;
    },
    saveSelectTaskId: (state, action) => {
      state.selectTaskId = action.payload.data;
    },
    saveProjectData: (state, action) => {
      state.projectData = action.payload.data;
    },
    saveUserData: (state, action) => {
      state.userData = action.payload.data;
    },
    saveProjects: (state, action) => {
      state.projects = action.payload.data;
    },
    saveMyTasks: (state, action) => {
      state.myTasks = action.payload.data;
    },
    setViewType: (state, action) => {
      state.viewType = action.payload.data;
    },
    changeModalType: (state, action) => {
      state.modalType = action.payload.data;
    },
    loginSuccess: (state) => {
      state.logined = true;
    },
    loginFailed: (state) => {
      state.logined = false;
    },
    showModal: (state) => {
      state.modalFlag = true;
    },
    closeModal: (state) => {
      state.modalFlag = false;
    },
    logoutAction: (state) => {
      localStorage.setItem("persist:root", {});
      state.logined = false;
    },
    setEntryIdToEdit: (state, action) => {
      state.entryId = action.payload;
    },
    setDrawerStatus: (state, action) => {
      state.drawerStatus = action.payload;
    },
  },
});

export const {
  loginSuccess,
  loginFailed,
  showModal,
  closeModal,
  saveUserData,
  saveProjectData,
  saveProjects,
  saveMyTasks,
  setViewType,
  logoutAction,
  setEntryIdToEdit,
  changeModalType,
  setCurrentDate,
  setCurStartEndDate,
  saveSelectProjectId,
  saveSelectTaskId,
  setDrawerStatus,
  saveSelectProjectNo,
  saveSelectEntryDate,
  saveSelectComment,
  saveSelectDuration
} = appSlice.actions;

export const selectLogined = (state) => state.appState.logined;
export const selectModalFlag = (state) => state.appState.modalFlag;
export const selectUserData = (state) => state.appState.userData;
export const selectProjectData = (state) => state.appState.projectData;
export const selectProjects = (state) => state.appState.projects;
export const selectViewType = (state) => state.appState.viewType;
export const selectEntryId = (state) => state.appState.entryId;
export const selectModalType = (state) => state.appState.modalType;
export const selectMyTasks = (state) => state.appState.myTasks;
export const selectCurrentDate = (state) => state.appState.currentDate;
export const selectCurStartEndDate = (state) => state.appState.curStartEndDate;
export const selectSelectProjectId = (state) => state.appState.selectProjectId;
export const selectSelectTaskId = (state) => state.appState.selectTaskId;
export const selectDrawerStatus = (state) => state.appState.drawerStatus;
export const selectSelectProjectNo = (state) => state.appState.selectProjectNo;
export const selectSelectEntryDate = (state) => state.appState.selectEntryDate;
export const selectSelectComment = (state) => state.appState.selectComment;
export const selectSelectDuration = (state) => state.appState.selectDuration;

export const loginUser = (user) => async (dispatch) => {
  const response = await userService.login(user);
  if (response.status === "success") {
    dispatch(loginSuccess());
    dispatch(saveUserData({ data: response.user }));
  } else {
    dispatch(loginFailed());
  }
};

export const getProductsWithDate = (req) => async (dispatch) => {
  const response = await projectService.getProjectDetail(req);
  if (response.status === "success")
    dispatch(saveProjects({ data: response.data }));
  else dispatch(saveProjects({ data: [] }));
};

export const getMyTasks = (userId) => async (dispatch) => {
  const response = await projectService.getTasksByUserId(userId);
  if (response.status === "success")
    dispatch(saveMyTasks({ data: response.data }));
  else dispatch(saveMyTasks({ data: [] }));
};

export default appSlice.reducer;
