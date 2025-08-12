import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "e-commerce-mvp API",
      version: "1.0.0",
      description: "A simple Express API documented with Swagger",
    },
    servers: [
      {
        url: "/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "..", "/routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export = swaggerSpec;
