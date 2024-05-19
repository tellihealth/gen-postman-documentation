"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.getAllCollections = void 0;
const axios_1 = __importDefault(require("axios"));
const getAllCollections = async () => {
    try {
        const response = await axios_1.default.get(`${process.env.POSTMAN_URL}/collections`, {
            headers: { "X-Api-Key": process.env.POSTMAN_API_KEY },
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
        const response = await axios_1.default.get(`${process.env.POSTMAN_URL}/collections/${collectionId}`, {
            headers: { "X-Api-Key": process.env.POSTMAN_API_KEY },
        });
        return response.data.collection;
    }
    catch (error) {
        console.error(error);
    }
};
exports.getCollection = getCollection;
