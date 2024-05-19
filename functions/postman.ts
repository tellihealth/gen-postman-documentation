import axios from "axios";

const getAllCollections = async () => {
  try {
    const response = await axios.get(`${process.env.POSTMAN_URL}/collections`, {
      headers: { "X-Api-Key": process.env.POSTMAN_API_KEY },
    });
    return response.data.collections;
  } catch (error) {
    console.error(error);
  }
};

const getCollection = async (collectionId: string) => {
  try {
    const response = await axios.get(
      `${process.env.POSTMAN_URL}/collections/${collectionId}`,
      {
        headers: { "X-Api-Key": process.env.POSTMAN_API_KEY },
      }
    );
    return response.data.collection;
  } catch (error) {
    console.error(error);
  }
};

export { getAllCollections, getCollection };
