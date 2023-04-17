const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

//.env to hide API
const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

//openAI API call
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

//Increment counter (entries) by 1 for each image rendered by the user
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

module.exports = {
    handleImage,
    handleApiCall
}
