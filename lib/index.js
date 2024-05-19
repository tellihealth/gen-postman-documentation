"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_1 = __importDefault(require("fs"));
const postman_1 = require("./functions/postman");
const statusCodes_1 = __importDefault(require("./utils/statusCodes"));
const transformItem = (item) => {
    if (item.type === "folder") {
        return {
            name: item.name,
            item: item.items ? item.items.map(transformItem) : [],
            description: item.description,
        };
    }
    else if (item.type === "request") {
        return {
            name: item.name,
            request: {
                method: item.method,
                header: item.headers
                    ? item.headers.map((header) => ({
                        key: header.key,
                        value: header.value,
                    }))
                    : [],
                body: item.body
                    ? {
                        mode: "raw",
                        raw: JSON.stringify(item.body, null, 2),
                        options: {
                            raw: {
                                language: "json",
                            },
                        },
                    }
                    : undefined,
                url: {
                    raw: item.url,
                    host: [item.url],
                },
                description: item.description,
            },
            response: item.responses
                ? item.responses.map((response) => {
                    var _a;
                    return ({
                        name: response.name,
                        code: response.status,
                        status: (_a = statusCodes_1.default.find((sc) => sc.code === Number(response.status))) === null || _a === void 0 ? void 0 : _a.message,
                        _postman_previewlanguage: "json",
                        body: JSON.stringify(response.body, null, 2),
                        header: item.headers
                            ? item.headers.map((header) => ({
                                key: header.key,
                                value: header.value,
                            }))
                            : [],
                    });
                })
                : [],
        };
    }
};
const run = async () => {
    try {
        const ymlFile = (0, core_1.getInput)("yml");
        const fileContents = fs_1.default.readFileSync(ymlFile, "utf8");
        const { collection: collectionName, items, folder: folderName, description, } = js_yaml_1.default.load(fileContents);
        const mutatedItems = items.map(transformItem);
        const collections = await (0, postman_1.getAllCollections)();
        if (collections.length > 0) {
            const collection = collections.find((c) => c.name === collectionName);
            if (collection) {
                const collectionData = await (0, postman_1.getCollection)(collection.uid);
                const folderIndex = collectionData.item.findIndex((item) => item.name === folderName);
                if (folderIndex !== -1) {
                    collectionData.item[folderIndex].description = description;
                    collectionData.item[folderIndex].item = mutatedItems;
                    console.log(JSON.stringify(collectionData, null, 2));
                }
                else {
                    (0, core_1.setFailed)("Folder was not found.");
                }
            }
            else {
                (0, core_1.setFailed)("Collection was not found.");
            }
        }
        else {
            (0, core_1.setFailed)("Collection was not found.");
        }
        const time = new Date().toTimeString();
        (0, core_1.setOutput)("postman-url", time);
    }
    catch (error) {
        (0, core_1.setFailed)(`Action failed with error: ${error}`);
    }
};
run();
