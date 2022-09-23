const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

// INITILIAZATION OF SERVER

const initializeDBserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log(`Server is up and running`);
    });
  } catch (error) {
    console.log(`DBerror ${error.message}`);
    process.exit(1);
  }
};

initializeDBserver();

// METHODS

// ### API 1

// #### Path: `/movies/`

// #### Method: `GET`

app.get("/movies/", async (request, response) => {
  const dbQuery = `
    SELECT movie_name AS movieName
    FROM 
    movie
    ORDER BY movie_id
    `;

  const moviesArray = await db.all(dbQuery);

  console.log(moviesArray);
  response.send(moviesArray);
});

// ### API 2

// #### Path: `/movies/`

// #### Method: `POST`

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;

  const dbQuery = `
    INSERT INTO 
    movie (director_id,movie_name,lead_actor )
    VALUES (${directorId}, '${movieName}', '${leadActor}' )
    `;

  const moviesArray = await db.run(dbQuery);
  const movie_id = moviesArray.lastID;

  response.send("Movie Successfully Added");
});

// ### API 3

// #### Path: `/movies/:movieId/`

// #### Method: `GET`

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const dbQuery = `
    SELECT 
    movie_id AS movieId,
  director_id AS directorId,
  movie_name AS movieName,
  lead_actor AS leadActor
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};
    `;

  const moviesArray = await db.get(dbQuery);
  console.log(moviesArray);
  response.send(moviesArray);
});

// ### API 4

// #### Path: `/movies/:movieId/`

// #### Method: `PUT`
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;

  const dbQuery = `
    UPDATE 
    movie
    SET 
        director_id = ${directorId}, 
        movie_name = '${movieName}', 
        lead_actor = '${leadActor}'  
    WHERE 
    movie_id = ${movieId};
    `;

  const moviesArray = await db.run(dbQuery);
  console.log(moviesArray);
  response.send("Movie Details Updated");
});

// ### API 5

// #### Path: `/movies/:movieId/`

// #### Method: `DELETE`
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const dbQuery = `
    DELETE 
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};
    `;

  const moviesArray = await db.run(dbQuery);
  console.log(moviesArray);
  response.send("Movie Removed");
});

// ### API 6

// #### Path: `/directors/`

// #### Method: `GET`
app.get("/directors/", async (request, response) => {
  const dbQuery = `
    SELECT director_id AS directorId,  director_name AS directorName
    FROM 
    director
    ORDER BY director_id
    `;

  const moviesArray = await db.all(dbQuery);

  console.log(moviesArray);
  response.send(moviesArray);
});

// ### API 7

// #### Path: `/directors/:directorId/movies/`

// #### Method: `GET`

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  console.log(directorId);
  const dbQuery = `
    SELECT movie_name AS movieName
    FROM 
    movie
    WHERE director_id = ${directorId}
    `;

  const moviesArray = await db.all(dbQuery);

  console.log(moviesArray);
  response.send(moviesArray);
});

module.exports = app;
