const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5001;

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database.db',
  },
  useNullAsDefault: true,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
  const { First_Name, Last_Name, Email, Phone_Number, Password, Confirm_Password, Gen } = req.body;

  if (Password !== Confirm_Password) {
    res.status(400).json({ error: 'Password and Confirm Password do not match.' });
    return;
  }

  try {
    await knex('users').insert({
      First_Name,
      Last_Name,
      Email,
      Phone_Number,
      Password,
      Confirm_Password,
      Gender: Gen,
    });

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

app.get('/api/search', async (req, res) => {
  const searchTerm = req.query.searchTerm;

  try {
    const results = await knex('users')
      .where('First_Name', 'like', `%${searchTerm}%`)
      .orWhere('Last_Name', 'like', `%${searchTerm}%`)
      .orWhere('Email', 'like', `%${searchTerm}%`)
      .orWhere('Phone_Number', 'like', `%${searchTerm}%`)
      .orWhere('Gender', 'like', `%${searchTerm}%`);

    res.json(results);
  } catch (error) {
    console.error('Error searching data:', error);
    res.status(500).json({ error: 'Error searching data.' });
  }
});

app.get('/api/get-submitted-data', async (req, res) => {
  try {
    const rows = await knex('users').select('*');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching submitted data:', error);
    res.status(500).json({ error: 'Error fetching submitted data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
