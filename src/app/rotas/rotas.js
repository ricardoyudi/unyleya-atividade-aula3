const db = require('../services/db');
const helperDb = require('../utils/helper-db');
const shortid = require('shortid');
const validUrl = require("valid-url");
const moment = require("moment");

module.exports = (app) => {

    app.post("/short-url", async (req, res, next) => {
        const { url } = req.body;
        const baseUrl = "http://localhost:3001";

        if (!validUrl.isUri(baseUrl)) {
            return res.status(400).json({ message: "Invalid base url" });
        }

        const data = await saveCode(url, baseUrl);

        return res.status(201).json(data);
    });

    app.get("/short-url/id/:id", async (req, res, next) => {
        const { id } = req.params;

        const data = await findCodeById(id)

        if(!data || data.length === 0) {
            return res.status(404).json({ message: "Id not found!" });
        }

        return res.status(201).json({"shortUrl": data[0].short_url});
    });

    app.get("/short-url/date/:date", async (req, res, next) => {
        const { date } = req.params;

        if(!moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ message: "Invalid date format!! Valid format is: YYYY-MM-DD" });
        }

        const data = await findCodeByDate(date);

        return res.status(201).json(data);
    });

    async function saveCode(url, baseUrl) {
        const shortUrl = baseUrl + "/" + shortid.generate();

        let sql = `INSERT INTO url_code(short_url, original_url, date_time_at)
        VALUES(?, ?, ?)`;

        const params = [shortUrl, url, new Date()];

        const rows = await db.query(sql, params);

        const data = helperDb.emptyOrRows(rows);

        return { id: data.insertId, url: url, shortUrl: shortUrl, dateTime: new Date };
    }

    async function findCodeById(id) {
   
        let sql = `SELECT * FROM url_code WHERE id = ?`;

        const params = [id];

        const rows = await db.query(sql, params);

        const data = helperDb.emptyOrRows(rows);

        return data;
    }

    async function findCodeByDate(date) {
   
        let sql = `SELECT * FROM url_code WHERE DATE(date_time_at) = ? `;

        const params = [date];

        const rows = await db.query(sql, params);

        const data = helperDb.emptyOrRows(rows);

        return data;
    }

}
