import axios from "axios";

const getProjectDetail = async (req) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/project/getProjectDetailbyTime`,
      req
    );
    if (response.data.success)
      return { status: "success", data: response.data.projects };
  } catch (e) {
    return { status: "failed" };
  }
};

const getTasksByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/project/getTasksByUserId/${userId}`
    );
    if (response.data.success)
      return { status: "success", data: response.data.tasks };
  } catch (e) {
    return { status: "failed" };
  }
};

export const projectService = {
  getProjectDetail,
  getTasksByUserId,
};
