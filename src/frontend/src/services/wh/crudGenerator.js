const getElementFunc = (apiBasePath, axiosInstance, convertApiToModelData) => {
  const getElement = async (id) => {
    const serverResp = await axiosInstance.get(`${apiBasePath}/${id}`);
    return convertApiToModelData(serverResp.data.data);
  };
  return getElement;
};

const listElementsFunc = (apiBasePath, axiosInstance, convertApiToModelData) => {
  const listElements = async () => {
    const serverResp = await axiosInstance.get(`${apiBasePath}`);
    return serverResp.data.data.map(convertApiToModelData);
  };
  return listElements;
};

const createElementFunc = (apiBasePath, axiosInstance, convertModelToApiData) => {
  const createElement = async (newElement) => {
    const serverResp = await axiosInstance.post(`${apiBasePath}`, convertModelToApiData(newElement));
    return serverResp.data.data;
  };
  return createElement;
};

const updateElementFunc = (apiBasePath, axiosInstance, convertModelToApiData) => {
  const updateElement = async (element) => {
    const serverResp = await axiosInstance.put(`${apiBasePath}/${element.id}`, convertModelToApiData(element));
    return serverResp.data.data;
  };
  return updateElement;
};

const deleteElementFunc = (apiBasePath, axiosInstance) => {
  const deleteElement = async (id) => {
    await axiosInstance.delete(`${apiBasePath}/${id}`);
  };
  return deleteElement;
};

export { getElementFunc, listElementsFunc, createElementFunc, updateElementFunc, deleteElementFunc };
