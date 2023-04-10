const handleRegister = (req, res, db, bcrypt) => {
    //pulling specific values from request body
    const { name, email, password } = req.body;
    //if there's missing fields -> won't process registration
    //Need return to end execution and not continue app.post
    if (!name || !email || !password) {
        return res.status(400).json('Incorrect form submission');//need return to end function if it gets returned
    }

    // bcrypt Usage - salt + hash 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //transaction wraps sql 'users' + 'login' tables(both to update or fail so tables don't update without one another)
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
        //returning all columns response of registered user
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date() 
                })
            //if successful -> send response of/return object of registered user
                .then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit)//commit changes (add) to DB tables if all matches
            .catch(trx.rollback)//if anything fails -> rollback changes
        })    
        
        .catch(err => res.status(400).json('Unable to register'))
};
//Get param ID. loop through users database -> find matching ID
//if user id = id in server params -> return user id
//**can't set headers after they're sent -> loops and callbacks that run 2+ times will try to re-set headers */
//Can do map or filter or find() to find user w/ ID 
//if length >1 -> return user

module.exports = {
    handleRegister
}