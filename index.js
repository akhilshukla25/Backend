require('dotenv').config()
const express = require('express');
const mssql = require('mssql');
const cors = require('cors')

const app = express();
const port = 5000;

// MSSQL configuration
const dbconfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  synchronize: true,
  trustServerCertificate: true,
  options: {
    encrypt: true // If you're on Windows Azure
  }
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// GET all data
app.get('/od_recon', async (req, res) => {
  try {
    const pool = await mssql.connect(dbconfig);
    const result = await pool.request().query('SELECT * FROM OD_RECON');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

// GET data by ID
app.get('/od_recon/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await mssql.connect(dbconfig);
    const result = await pool
      .request()
      .input('id', mssql.Int, id)
      .query('SELECT * FROM OD_RECON WHERE id = @id');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

// POST data
app.post('/od_recon', async (req, res) => {
  const { CLIENT_NAME, HUSBAND_NAME, LOAN_ID, LOAN_AMOUNT, CURRENT_OS, REMARKS, OD_STATUS } = req.body;
  try {
    const pool = await mssql.connect(dbconfig);
    const result = await pool
      .request()
      .input('CLIENT_NAME', mssql.NVarChar, CLIENT_NAME)
      .input('HUSBAND_NAME', mssql.NVarChar, HUSBAND_NAME)
      .input('LOAN_ID', mssql.NVarChar, LOAN_ID)
      .input('LOAN_AMOUNT', mssql.NVarChar, LOAN_AMOUNT)
      .input('CURRENT_OS', mssql.NVarChar, CURRENT_OS)
      .input('REMARKS', mssql.NVarChar, REMARKS)
      .input('OD_STATUS', mssql.NVarChar, OD_STATUS)
      .query('INSERT INTO OD_RECON (CLIENT_NAME,HUSBAND_NAME,LOAN_ID,LOAN_AMOUNT,CURRENT_OS,REMARKS,OD_STATUS) VALUES (@CLIENT_NAME, @HUSBAND_NAME,@LOAN_ID,@LOAN_AMOUNT,@CURRENT_OS,@REMARKS,@OD_STATUS)');
    res.send('Data added successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

// PUT data (update)
app.put('/od_recon/:id', async (req, res) => {
  const id = req.params.id;
  const { CLIENT_NAME, HUSBAND_NAME, LOAN_ID, LOAN_AMOUNT, CURRENT_OS, REMARKS, OD_STATUS } = req.body;
  try {
    const pool = await mssql.connect(dbconfig);
    const result = await pool
      .request()
      .input('ID', mssql.Int, id)
      .input('CLIENT_NAME', mssql.NVarChar, CLIENT_NAME)
      .input('HUSBAND_NAME', mssql.NVarChar, HUSBAND_NAME)
      .input('LOAN_ID', mssql.NVarChar, LOAN_ID)
      .input('LOAN_AMOUNT', mssql.NVarChar, LOAN_AMOUNT)
      .input('CURRENT_OS', mssql.NVarChar, CURRENT_OS)
      .input('REMARKS', mssql.NVarChar, REMARKS)
      .input('OD_STATUS', mssql.NVarChar, OD_STATUS)
      .query('UPDATE OD_RECON SET CLIENT_NAME = @CLIENT_NAME, HUSBAND_NAME = @HUSBAND_NAME, LOAN_ID = @LOAN_ID, LOAN_AMOUNT = @LOAN_AMOUNT,CURRENT_OS = @CURRENT_OS, REMARKS = @REMARKS, OD_STATUS = @OD_STATUS WHERE ID = @id');
    console.log("qry", result)
    res.send('Data updated successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

// DELETE data
app.delete('/od_recon/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await mssql.connect(dbconfig);
    const result = await pool
      .request()
      .input('id', mssql.Int, id)
      .query('DELETE FROM OD_RECON WHERE id = @id');
    res.send('Data deleted successfully');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Something went wrong');
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});