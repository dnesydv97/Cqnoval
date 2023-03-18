import {
    getAllProject,
    getProjectDetail,
    addProjectReference,
    getTenderDetail,
    getAllTender,
} from 'services';
import {onError} from 'utils';
import {
    GET_PROJECT_START,
    GET_PROJECT_SUCCESS,
    GET_PROJECT_FAIL,
    ADD_PROJECT_SUCCESS,
    UPDATE_PROJECT,
    UPDATE_TENDER,
    GET_TENDER_START,
    GET_TENDER_SUCCESS,
    GET_TENDER_FAIL,
    ADD_TENDER_SUCCESS,
    RESET_ADD_UPDATE_TENDER_REDUCER,
    RESET_ADD_UPDATE_PROJECT_REDUCER,
} from './constant';

export function fetchTender(SkipCount, SearchKeyword, Sorting) {
    return (dispatch) => {
        dispatch(getTenderStart());
        getAllTender(SkipCount, SearchKeyword, Sorting)
            .then((response) => {
                if(response.status === 200)  {
                    dispatch(getTenderSuccess(response.data));
                }
            })
            .catch((error) => {
                onError(error);
                dispatch(getTenderFail(error.message));
            });
    };
}

export function fetchProject(SkipCount, SearchKeyword, Sorting) {
    return (dispatch) => {
        dispatch(getProjectStart());
        getAllProject(SkipCount, SearchKeyword, Sorting)
            .then((response) => {
                console.log('Get Project Response', response);
                if(response.status === 200) {
                    dispatch(getProjectSuccess(response.data));
                }
                else dispatch(getProjectFail(response.message));
            })
            .catch((error) => {
                onError(error);
                dispatch(getProjectFail(error.message));
            });
    };
}

export function addNewTender(tender) {
    return (dispatch) => {
        dispatch(getTenderStart());
        addTenderReference(tender)
            .then((response) => {
                if(response.status === 200) {
                    dispatch(addTenderSuccess(response.data));
                } else dispatch(getTenderFail(response.message));
            })
            .catch((error) => {
                onError(error);
                dispatch(getTenderFail(error.message));
            });
    };
}

export function addNewProject(project) {
    return (dispatch) => {
        dispatch(getProjectStart());
        addProjectReference(project)
            .then((response) => {
                console.log('Add Project Response', response);
                if(response.status === 200) {
                    dispatch(addProjectSuccess(response.data));
                } else dispatch(getProjectFail(response.message));
            })
            .catch((error) => {
                onError(error);
                dispatch(getProjectFail(error.message));
            });
    };
}
export function updateTenderDetail(tender) {
    return (dispatch) => {
        dispatch(getTenderStart());
        updateTender(tender, tender.id)
            .then((response) => {
                if(response.status === 200) {
                    dispatch(updateTenderSuccess(response.data));
                } else dispatch(getTenderFail(response.message));
            })
            .catch((error) => {
                onError(error);
                dispatch(getTender(error.message));
            });
    };
}

export function updateProjectDetail(project) {
    return (dispatch) => {
        dispatch(getProjectStart());
        updateProject(project, project.id)
            .then((response) => {
                console.log('Update Project response', response);
                if(response.status === 200) {
                    dispatch(updateProjectSuccess(response.data));
                } else dispatch(getProjectFail(response.message));
            })
            .catch((error) => {
                onError(error);
                dispatch(getProjectFail(error.message));
            });
    };
}

export function resetAddUpdateTenderReducer() {
    return (dispatch) => {
        dispatch({
            type: RESET_ADD_UPDATE_TENDER_REDUCER,
        });
    }
}
export function resetAddUpdateProjectreducer() {
    return (dispatch) => {
        dispatch({
            type: RESET_ADD_UPDATE_PROJECT_REDUCER,
        });
    };
}

const getProjectStart = () => {
    return {
        type: GET_PROJECT_START,
    };
};

const getTenderStart = () => {
    return {
        type: GET_TENDER_START,
    };
};

const getProjectSuccess = (data) => {
    return {
        type: GET_PROJECT_SUCCESS,
        data,
    };
};

const getTenderSuccess = (data) => {
    return {
        type: GET_TENDER_SUCCESS,
        data,
    };
};

const addProjectSuccess = (data) => {
    return {
        type: ADD_PROJECT_SUCCESS,
        data,
    };
};

const addTenderSuccess = (data) => {
    return {
        type: ADD_TENDER_SUCCESS,
        data,
    };
};

const updateProjectSuccess = (data) => {
    return {
        type: UPDATE_PROJECT,
        data,
    };
};

const updateTenderSuccess = (data) => {
    return {
        type: UPDATE_TENDER,
        data,
    };
};

const getTenderFail = (errorMessage) => {
    return {
        type: GET_TENDER_FAIL,
        errorMessage,
    };
};

const getProjectFail = (errorMessage) => {
    return {
        type: GET_PROJECT_FAIL,
        errorMessage,
    };
};
