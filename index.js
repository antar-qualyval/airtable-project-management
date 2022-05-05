const express = require("express");
const cors = require("cors");
const Airtable = require("airtable");
const app = express();
require("dotenv").config({ path: "config.env" });
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
const {
  AIRTABLE_API_KEY,
  AIRTABLE_TEMPLATE_BASE_ID,
  AIRTABLE_TEMPLATE_TABLE_1_ID,
} = process.env;

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const templateBase = airtable.base(AIRTABLE_TEMPLATE_BASE_ID);

app.get("/getDetails", (req, res, next) => {
  let allRecords = [];
  templateBase(AIRTABLE_TEMPLATE_TABLE_1_ID)
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 10,
      view: "Grid view",
      fields: ["Task", "Sub Task"],
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        allRecords = records;
        records.forEach(function (record) {
          console.log("Retrieved", record);
        });

        fetchNextPage();
      },
      function done(err, data) {
        console.log(data);
        if (err) {
          console.error(err);
          return res
            .status(404)
            .json({ success: false, message: "Something Went Wrong🍪🍪" });
        }

        return res.status(200).json({
          success: false,
          message: "Working all fine ",
          allRecords,
        });
      }
    );
});

app.post("/saveData", async (req, res, next) => {
  //   console.log(req.body);
  await templateBase(AIRTABLE_TEMPLATE_TABLE_1_ID).create(
    [
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
      req.body,
    ],
    function (err, data) {
      console.log(data);

      if (err) {
        return res.status(404).json({ success: false, message: err.message });
      }

      return res
        .status(200)
        .json({ success: true, message: "Working Fine", data: data });
    }
  );
});

app.get("/records/:id", async (req, res, next) => {
  templateBase(AIRTABLE_TEMPLATE_TABLE_1_ID).find(
    req.params.id,
    function (err, record) {
      if (err) {
        console.error(err);
        return res
          .status(404)
          .json({ success: false, message: "Something Went Wrong🍪🍪", err });
      }
      console.log("Retrieved", record.id);
      return res
        .status(200)
        .json({ success: true, message: "Working Fine", data: record });

    }
  );
});

app.listen(port, () => console.log("Your app is listening", port));
