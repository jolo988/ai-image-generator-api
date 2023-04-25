const handleRegister = async (req, res, db, bcrypt) => {
    //pulling specific values from request body
    try {

        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json('Incorrect form submission');//need return to end function if it gets returned
        }
        
        // bcrypt Usage - salt + hash 
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

    //transaction wraps sql 'users' + 'login' tables(both to update or fail so tables don't update without one another)
        const user = await db.transaction(async (trx) => {
            const loginEmail = await trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email');

            const registeredUser = await trx('users')
            //returning all columns response of registered user
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0].email,
                joined: new Date() 
            });

            return registeredUser[0];
        });

                //if successful -> send response of/return object of registered user
        res.json(user);
    } catch (err) {
        res.status(400).json('Unable to register')
    }
};

module.exports = {
    handleRegister
}
