const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = '2-61002704';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// HOMEPAGE — GET / — list all games
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,genre,publisher,link`;
    try {
        const response = await axios.get(url, { headers });
        const games = response.data.results;
        res.render('homepage', { title: 'Games | Integrating With HubSpot I Practicum', games });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching games from HubSpot');
    }
});

// FORM PAGE — GET /update-cobj
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// FORM SUBMIT — POST /update-cobj
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const newGame = {
        properties: {
            name: req.body.name,
            genre: req.body.genre,
            publisher: req.body.publisher,
            link: req.body.link
        }
    };
    try {
        await axios.post(url, newGame, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error creating game in HubSpot');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

