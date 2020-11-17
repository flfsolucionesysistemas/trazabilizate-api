let config = {
    port:3002,
    database:{
        host: '52.14.22.254',
        user: 'root',
        password:'USrrh7H6fb',
        database:'trazabilidad'
    },
    /*database:{
        host: 'localhost',
        user: 'root',
        password:'',
        database:'la_casona_web'
    },*/
    session:{
        secretPass:'trazabilidadsession',
        maxAge: 123
    },

}
module.exports = config
