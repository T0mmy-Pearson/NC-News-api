const db = require("../db/connection")
const endpointsJson = require("../endpoints.json")

exports.selectTopics = (req, res, next) => {
    const query = `SELECT * FROM topics;`
    return db.query(query)
        .then((result) => {

        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        }
      return result.rows;
    });
};


