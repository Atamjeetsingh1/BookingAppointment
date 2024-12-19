import makeApiCall from "./BaseApi";
const { REACT_APP_BASE_URL } = process.env;

const login = async (data) => {
    console.log(data,"lgin")
    const url = `${REACT_APP_BASE_URL}/specialist/login`;
    return await makeApiCall("post", url, data,false);
};

const signup = async (data) => {
    const url = `${REACT_APP_BASE_URL}/specialist/signup`;
    return await makeApiCall("post", url, data,false);
};

const AvailabilityCall = async (data) => {
    const url = `${REACT_APP_BASE_URL}/schedule/set`;
    return await makeApiCall("post", url, data);
};
const Create = async (data) => {
    const url = `${REACT_APP_BASE_URL}/schedule`;
    return await makeApiCall("post", url, data,true);
};
const Edit = async (data) => {
    const url = `${REACT_APP_BASE_URL}/schedule`;
    return await makeApiCall("put", url, data,true);
};
const getSpecificAdmin= async (id) => {
    const url = `${REACT_APP_BASE_URL}/specialist/${id}`;
    return await makeApiCall("get", url);
};

const getList= async () => {
    const url = `${REACT_APP_BASE_URL}/specialist/`;
    return await makeApiCall("get", url);
};
const getSchedulesById= async (schedule_id) => {
    const url = `${REACT_APP_BASE_URL}/schedule?schedule_id=${schedule_id}`;
    return await makeApiCall("get", url);
};

const getSchedules= async (startDate,endDate) => {
    const url = `${REACT_APP_BASE_URL}/schedule?from_date=${startDate}&end_date=${endDate}`;
    return await makeApiCall("get", url);
};
export {login,signup,AvailabilityCall,getSpecificAdmin,getList,Create,Edit,getSchedules,getSchedulesById}
