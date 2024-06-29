# Gen Postman Documentation

Using this GitHub action, you can take ownership of a Postman folder, allowing you to generate API documentation using a readable YML file. It's very intuitive and comes with schema definitions that enable your editor to support linting and autocomplete.

You can connect to multiple folders using multiple YML schema files, allowing one repository to manage multiple domains.

## Usage/Examples

Here is an easy example for you to get started with.

### Create A new Postman Collection + Folder

You must have a valid Postman collection named "Development" and a folder named "Users" within it. This allows the tool to take control of the entire folder.

### .github/workflows/dev.yml

```yml
name: "Deploying To Dev Environment"

on:
  push:
    branches:
      - development

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        name: "Checkout Repository"
      - uses: tellihealth/gen-postman-documentation@1.0.3
        name: "Generate Postman Documentation - Users"
        with:
          api-key: ${{ secrets.POSTMAN_API_KEY }}
          collection: "Development"
          yml: "schema/users.yml"
```

### schema/users.yml

```yml
folder: "Users"
description: A mock postman API documentation schema.
items:
  - name: "Create A New User"
    type: "request"
    url: "{{baseUrl}}/users"
    method: "POST"
    description: |
      Sign up a new user by providing the `name` and `type` of the user.
    body: { "name": "Test User", "type": "driver" }
    headers:
      - key: "Content-Type"
        value: "application/json"
      - key: "Authorization"
        value: "Bearer {{apiKey}}"
    responses:
      - name: "User Created"
        status: 201
        body: { "id": 3, "name": "Test User", type: "driver" }
  - name: "Settings"
    type: "folder"
    description: Manage user settings here.
    items:
      - name: "Update User"
        type: "request"
        url: "{{baseUrl}}/users/1"
        method: "PUT"
        description: |
          Update a user's information by using the `name` and `type` of the user.
        body: { "name": "Test User 2", "type": "passenger" }
        headers:
          - key: "Content-Type"
            value: "application/json"
          - key: "Authorization"
            value: "Bearer {{apiKey}}"
        responses:
          - name: "User Updated"
            status: 200
            body: { "id": 1, "name": "Test User 2", type: "passenger" }
          - name: "User Not Found"
            status: 404
            body: { "error": "User Not Found" }
```

This example creates a new request under the `Users` folder named "Create A New User," including examples with multiple responses. Additionally, it creates a subfolder named `Settings`, where you'll find a new request named "Update User" with the same attributes.

## Supported Formatting

#### Response Codes

| Code  | Description              |
| :---- | :----------------------- |
| `200` | `OK`                     |
| `201` | `Created`                |
| `204` | `No Content`             |
| `304` | `Not Modified`           |
| `400` | `Bad Request`            |
| `401` | `Unauthorized`           |
| `403` | `Forbidden`              |
| `404` | `Not Found`              |
| `405` | `Method Not Allowed`     |
| `409` | `Conflict`               |
| `410` | `Gone`                   |
| `415` | `Unsupported Media Type` |
| `422` | `Unprocessable Entity`   |
| `429` | `Too Many Requests`      |
| `500` | `Internal Server Error`  |
| `503` | `Service Unavailable`    |

#### Request Methods

```
["POST", "GET", "PUT", "PATCH", "DELETE"]
```

## Frequently Asked Questions

#### Why do I must create a folder under the collection? Why can't you automatically generate it?

If that were the case, we would fail to take full control over a domain within Postman. You would need to manually delete requests and folders that were previously generated when your schema changes. By selecting a folder, your schema can serve as the source of truth.

#### Can we publish to multiple collection at once?

By adding an additional task to the GitHub workflow, you can seamlessly connect to another Postman account or collection. This flexible approach allows you to incorporate as many records as needed, ensuring comprehensive coverage across various domains.

x x
