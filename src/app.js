const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({
      message: `The specified ID (${id}) is not valid!`
    });
  }

  return next();
}

function validateRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories
    .findIndex(repository => repository.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({
      message: `The repository with ID (${id}) was not found`
    });
  }

  return next();
}

app.use('/repositories/:id', validateId, validateRepositoryExists);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const { id } = request.params;

  const repoIndex = repositories
    .findIndex(repository => repository.id === id);

  const repository = repositories
  .find(repository => repository.id === id);

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories
    .findIndex(repository => repository.id === id);
    
  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { title, url, techs } = request.body;

  const { id } = request.params;

  const repoIndex = repositories
    .findIndex(repository => repository.id === id);

  const repository = repositories
  .find(repository => repository.id === id);

  repository.likes++;

  repositories[repoIndex] = repository;

  return response.json(repository);
});

module.exports = app;