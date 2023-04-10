const handleProfileGet = async (req, res, db) => {
    try {
        const { id } = req.params;
        const user = await db.select('*').from('users').where({id});
        if (user.length) {
                    res.json(user[0])
                } else {
                    res.status(400).json('Username not found')
                }
        } catch (err) {
            res.status(500).json('Server error')
        }
}



// const handleProfileGet = (req, res, db) => {
//     const { id } = req.params;
//     db.select('*').from('users').where({id})
//         .then(user => {
//             if (user.length) {
//                 res.json(user[0])
//             } else {
//                 res.status(400).json('Username not found')
//             }
//         })
// }

module.exports = {
    handleProfileGet
}
