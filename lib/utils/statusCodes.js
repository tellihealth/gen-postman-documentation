"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes = [
    {
        code: 200,
        message: "OK",
    },
    {
        code: 201,
        message: "Created",
    },
    {
        code: 204,
        message: "No Content",
    },
    {
        code: 304,
        message: "Not Modified",
    },
    {
        code: 400,
        message: "Bad Request",
    },
    {
        code: 401,
        message: "Unauthorized",
    },
    {
        code: 403,
        message: "Forbidden",
    },
    {
        code: 404,
        message: "Not Found",
    },
    {
        code: 405,
        message: "Method Not Allowed",
    },
    {
        code: 409,
        message: "Conflict",
    },
    {
        code: 410,
        message: "Gone",
    },
    {
        code: 415,
        message: "Unsupported Media Type",
    },
    {
        code: 422,
        message: "Unprocessable Entity",
    },
    {
        code: 429,
        message: "Too Many Requests",
    },
    {
        code: 500,
        message: "Internal Server Error",
    },
    {
        code: 503,
        message: "Service Unavailable",
    },
];
exports.default = statusCodes;
