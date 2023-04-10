const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

//hide API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

const handleApiCall = (req, res) => {
    const prompt = req.body.input;
    openai.createImage({
        prompt,
        n: 1,
    })
    .then((aiResponse) => {
        const image = aiResponse.data.data[0].url;
        res.json({ image })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Server error')
    });
}

//for every image submitted in frontend -> hit this route -> increase counter when submitting image
//find user ID to update entries (receiving from body instead of params)
//if found -> res w/ user.entries + increase
//if ID in DB = id found in body -> INCREMENT COUNTER

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {res.json(entries[0].entries)})
    .catch(err => res.status(400).json('Unable to update entries'))

}

module.exports = {
    handleImage,
    handleApiCall
}
