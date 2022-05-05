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
  AIRTABLE_PROJECT_BASE_ID,
  AIRTABLE_PROJECT_TEMPLATE_ID,
  AIRTABLE_TASK_TABLE_ID
} = process.env;

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const projectBase = airtable.base(AIRTABLE_PROJECT_BASE_ID);

// All All Record List ( Template Table)
app.get("/getDetails", (req, res, next) => {
  let allRecords = [];
  projectBase(AIRTABLE_PROJECT_TEMPLATE_ID)
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
  await projectBase(AIRTABLE_PROJECT_TEMPLATE_ID).create(
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
app.get("/", (req, res) => res.send("<h3>API Working Find</h3>"));




app.get("/records/:id", async (req, res, next) => {
  projectBase(AIRTABLE_PROJECT_TEMPLATE_ID).find(
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

app.post("/saveTask", async (req, res, next) => {
  const { name } = req.query;
  const filteredRecords = [];
  console.log(name);
  projectBase(AIRTABLE_PROJECT_TEMPLATE_ID)
    .select({
      filterByFormula: `{Task} = "${name}"`,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          filteredRecords.push({fields: record.fields});
          console.log(record.fields);
          // console.log("Retrieved", record.get("Task"));
        });

        fetchNextPage();
      },
      async function done(err) {
        if (err) {
          console.error(err);
          return;
        }
console.log(filteredRecords);
        await projectBase(AIRTABLE_TASK_TABLE_ID).create(
          filteredRecords,
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
      }
    );


});

app.listen(port, () => console.log("Your app is listening", port));
