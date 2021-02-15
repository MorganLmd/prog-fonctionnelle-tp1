import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

const getCatFacts = async () => {
  try {
    const response = await axios.get(
      'https://cat-fact.herokuapp.com/facts/random',
      {
        params: {
          animal_type: 'cat',
          amount: 3,
        },
      },
    );
    return response.data.map((catFact) => catFact.text);
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getRandomFox = async () => {
  try {
    const response = await axios.get('https://randomfox.ca/floof/');
    return response.data.image;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getPublicHolidays = async (country) => {
  try {
    const response = await axios.get(
      `https://date.nager.at/api/v2/PublicHolidays/2021/${country}`,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

app.post('/', async (req, res) => {
  const [catFacts, foxPicture, holidays] = await Promise.all([
    getCatFacts(),
    getRandomFox(),
    getPublicHolidays(req.body?.countryCode ?? ''),
  ]);

  return {
    foxPicture,
    catFacts,
    holidays,
  };
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
