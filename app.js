const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/ShortUrl');

const app = express();
const port = process.env.PORT || 3000;
const mongodbUrl =
  'mongodb+srv://shrink:mX8nyFdvAKFuWm1V@cluster0-rr2ek.mongodb.net/urls?retryWrites=true&w=majority';

const mongodbConnOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(mongodbUrl, mongodbConnOpts);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  let urls = await ShortUrl.find();
  res.render('index', { urls });
});

app.post('/shrink', async (req, res) => {
  await ShortUrl.create({
    full: req.body.fullUrl
  });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  let urlObject = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (urlObject == null) return res.sendStatus(404);

  urlObject.clicks++;
  urlObject.save();

  res.redirect(urlObject.full);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
