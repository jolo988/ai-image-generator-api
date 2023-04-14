const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

//hide API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

const handleApiCall = async (req, res) => {
    try {
        const prompt = req.body.input;

        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
        });

        const image = aiResponse.data.data[0].url;
        res.json({ image })
    } 
    catch (err) {
            console.log(err);
            res.status(500).send('Server error')
    };
}

//for every image submitted in frontend -> hit this route -> increase counter when submitting image
//find user ID to update entries (receiving from body instead of params)
//if found -> res w/ user.entries + increase
//if ID in DB = id found in body -> INCREMENT COUNTER


const handleImage = async (req, res, db) => {
    try {
        const { id } = req.body;
        const result = await db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries');
        res.json(result[0].entries)
    } 
    catch (err) { 
        res.status(400).json('Unable to update entries')
    }
}

// const handleImage = (req, res, db) => {
//     const { id } = req.body;
//     db('users').where('id', '=', id)
//     .increment('entries', 1)
//     .returning('entries')
//     .then(entries => {res.json(entries[0].entries)})
//     .catch(err => res.status(400).json('Unable to update entries'))

// }

module.exports = {
    handleImage,
    handleApiCall
}
