import axios from "axios";

const apiURL = "https://api.getpostman.com";
let apiKey = "";

const setAPIKey = (key: string) => {
  apiKey = key;
};

const getAllCollections = async () => {
  try {
    const response = await axios.get(`${apiURL}/collections`, {
      headers: { "X-Api-Key": apiKey },
    });
    return response.data.collections;
  } catch (error) {
    console.error(error);
  }
};

const getCollection = async (collectionId: string) => {
  try {
    const response = await axios.get(`${apiURL}/collections/${collectionId}`, {
      headers: { "X-Api-Key": apiKey },
    });
    return response.data.collection;
  } catch (error) {
    console.error(error);
  }
};

const updateCollection = async (collectionId: string, data: any) => {
  try {
    const response = await axios.put(
      `${apiURL}/collections/${collectionId}`,
      data,
      {
        headers: { "X-Api-Key ": apiKey },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { setAPIKey, getAllCollections, getCollection, updateCollection };
