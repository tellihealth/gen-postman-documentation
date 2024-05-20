import fs from "fs";
import yaml from "js-yaml";
import {
  getAllCollections,
  getCollection,
  setAPIKey,
  updateCollection,
} from "./functions/postman";
import { getInput, setFailed } from "@actions/core";
import statusCodes from "./utils/statusCodes";
import inputSchema from "./utils/dataValidation";

interface Header {
  key: string;
  value: string;
}

interface Response {
  name: string;
  status: string;
  code: number;
  body: string;
  headers: Header[];
}

interface Item {
  name: string;
  type: string;
  url?: string;
  method?: string;
  description?: string;
  body?: Body;
  headers?: Header[];
  item?: Item[];
  request?: Request[];
}

interface YMLItems {
  name: string;
  type: string;
  url?: string;
  method?: string;
  description?: string;
  body?: any;
  headers?: Header[];
  items?: Item[];
  responses?: Response[];
}

const transformItem = (item: YMLItems): any => {
  if (item.type === "folder") {
    return {
      name: item.name,
      item: item.items ? item.items.map(transformItem) : [],
      description: item.description,
    };
  } else if (item.type === "request") {
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
              raw: JSON.stringify(item.body, null, 4),
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
        ? item.responses.map((response) => ({
            name: response.name,
            code: response.status,
            status: statusCodes.find(
              (sc) => sc.code === Number(response.status)
            )?.message,
            _postman_previewlanguage: "json",
            body: JSON.stringify(response.body, null, 4),
            header: item.headers
              ? item.headers.map((header) => ({
                  key: header.key,
                  value: header.value,
                }))
              : [],
          }))
        : [],
    };
  }
};

const run = async () => {
  try {
    const collectionName = getInput("collection");

    setAPIKey(getInput("api-key"));

    const ymlFile = getInput("yml");

    if (!fs.existsSync(ymlFile)) {
      setFailed("YML file not found.");
      return;
    }

    const fileContents = fs.readFileSync(ymlFile, "utf8");
    const input = yaml.load(fileContents);

    const {
      items,
      folder: folderName,
      description,
    } = input as {
      items: any[];
      folder: string;
      description: string;
    };

    const validate = inputSchema.safeParse({
      collection: collectionName,
      folder: folderName,
      description,
      items,
    });

    if (!validate.success) {
      setFailed(`Invalid Schema: ${JSON.stringify(validate.error.format())}`);
      return;
    }

    const mutatedItems = items.map(transformItem);
    const collections = await getAllCollections();

    if (collections.length > 0) {
      const collection = collections.find(
        (c: any) => c.name === collectionName
      );

      if (collection) {
        const collectionData = await getCollection(collection.uid);

        const folderIndex = collectionData.item.findIndex(
          (item: any) => item.name === folderName
        );

        if (folderIndex !== -1) {
          collectionData.item[folderIndex].description = description;
          collectionData.item[folderIndex].item = mutatedItems;

          await updateCollection(collection.uid, {
            collection: collectionData,
          });

          console.log("Collection updated successfully.");
        } else {
          setFailed("Folder was not found.");
        }
      } else {
        setFailed("Collection was not found.");
      }
    } else {
      setFailed("Collection was not found.");
    }
  } catch (error) {
    setFailed(`Action failed with error: ${error}`);
  }
};

run();
