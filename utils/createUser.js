const bcrypt = require('bcrypt')
const Korisnik = require('../models/korisnik')

async function createUser(data) {
    const runde = 10
    const passHash = await bcrypt.hash(data.pass, runde)

    const korisnik = new Korisnik({
        email: data.email,
        passHash: passHash,
        admin: data.admin
    })

    const noviKorisnik = await korisnik.save()
    return noviKorisnik
}

module.exports = createUser 