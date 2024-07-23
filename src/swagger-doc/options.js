export const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Cargologik",
      version: "1.0.0",
      description: "Prueba backend para Cargologik",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Julian Rodriguez",
        url: "https://github.com/julandrod",
        email: "julian.andres.rodriguez@gmail.com",
      },
    },
    servers: [
      {
        url: "",
      },
    ],
  },
  apis: ["./src/routes/docs.yaml", "./src/swagger-doc/schemas/*.yaml", "./src/swagger-doc/paths/*.yaml"],
};
