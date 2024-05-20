"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCollection = exports.getCollection = exports.getAllCollections = exports.setAPIKey = void 0;
const axios_1 = __importDefault(require("axios"));
const apiURL = "https://api.getpostman.com";
let apiKey = "";
const setAPIKey = (key) => {
    apiKey = key;
};
exports.setAPIKey = setAPIKey;
const getAllCollections = async () => {
    try {
        const response = await axios_1.default.get(`${apiURL}/collections`, {
            headers: { "X-Api-Key": apiKey },
        });
        return response.data.collections;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getAllCollections = getAllCollections;
const getCollection = async (collectionId) => {
    try {
        const response = await axios_1.default.get(`${apiURL}/collections/${collectionId}`, {
            headers: { "X-Api-Key": apiKey },
        });
        return response.data.collection;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getCollection = getCollection;
const updateCollection = async (collectionId, data) => {
    try {
        const response = await axios_1.default.put(`${apiURL}/collections/${collectionId}`, data, {
            headers: { "X-Api-Key ": apiKey },
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
};
exports.updateCollection = updateCollection;
