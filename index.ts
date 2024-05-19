import { getInput, setOutput, setFailed } from "@actions/core";
import yaml from "js-yaml";
import fs from "fs";
import { getAllCollections, getCollection } from "./functions/postman";
import statusCodes from "./utils/statusCodes";

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

interface Body {
  page: number;
  limit: number;
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
  response?: Response[];
}

interface YMLItems {
  name: string;
  type: string;
  url?: string;
  method?: string;
  description?: string;
  body?: Body;
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
    const ymlFile = getInput("yml");
    const fileContents = fs.readFileSync(ymlFile, "utf8");
    const {
      collection: collectionName,
      items,
      folder: folderName,
      description,
    } = yaml.load(fileContents) as {
      collection: string;
      items: any[];
      folder: string;
      description: string;
    };

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

          console.log(JSON.stringify(collectionData, null, 2));
        } else {
          setFailed("Folder was not found.");
        }
      } else {
        setFailed("Collection was not found.");
      }
    } else {
      setFailed("Collection was not found.");
    }

    const time = new Date().toTimeString();
    setOutput("postman-url", time);
  } catch (error) {
    setFailed(`Action failed with error: ${error}`);
  }
};

run();
