const handleRegister = (req, res, db, bcrypt) => {

    // Destructuring request

    const { name, email, password } = req.body

        // Validation
    if (!name || !email || !password){
        // If RETURN gets executed, the code below will not run
        return res.status(400).json('Incorrect form submission')
    }

    // Hashing the password
    const hash = bcrypt.hashSync(password)

    // Pushing a new user to the database
    // Putting 2 things at once -- to 'login' and 'users' databases
    // Inserted to 'login' that returned the email
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json("unable to register"))

}

module.exports = {
    handleRegister: handleRegister
}