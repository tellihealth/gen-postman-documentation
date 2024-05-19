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
  items?: Item[];
  responses?: Response[];
}

const transformItem = (item: Item): any => {
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
          ? { mode: "raw", raw: JSON.stringify(item.body) }
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
            body: JSON.stringify(response.body),
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
    const { collection: collectionName, items } = yaml.load(fileContents) as {
      collection: string;
      items: any[];
    };

    const mutatedItems = items.map(transformItem);

    console.log(JSON.stringify(mutatedItems, null, 2));

    // Data Validation Using Zod
    // Todo

    const collections = await getAllCollections();
    // If Collection Exists
    if (collections.length > 0) {
      const collection = collections.find(
        (c: any) => c.name === collectionName
      );

      if (collection) {
        // Get Collection Data
        //const collectionData = await getCollection(collection.uid);
        //console.log("Collection Data", collectionData);
      } else {
        setFailed("Collection was not found.");
      }
    } else {
      setFailed("Collection was not found.");
    }

    // Get Collection Data

    const time = new Date().toTimeString();
    setOutput("postman-url", time);
  } catch (error) {
    setFailed(`Action failed with error: ${error}`);
  }
};

console.log("Hello World!");
run();

function updateCollectionItems(
  collectionItems: Item[],
  desiredItems: Item[]
): Item[] {
  const updatedCollection = [...collectionItems];

  desiredItems.forEach((desiredItem) => {
    const index = updatedCollection.findIndex(
      (item) => item.name === desiredItem.name
    );

    if (index !== -1) {
      // Item exists, update it
      const existingItem = updatedCollection[index];

      if (
        desiredItem.type === "folder" &&
        existingItem.items &&
        desiredItem.items
      ) {
        // If both are folders, update their items recursively
        existingItem.items = updateCollectionItems(
          existingItem.items,
          desiredItem.items
        );
      } else {
        // Update specific fields of the existing item
        updatedCollection[index] = { ...existingItem, ...desiredItem };
      }
    } else {
      // Item does not exist, add it
      updatedCollection.push(desiredItem);
    }
  });

  return updatedCollection;
}
