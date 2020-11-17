let config = {
    port:3002,
    database:{
        host: 'localhost',
        user: 'root',
        password:'USrrh7H6fb',
        database:'trazabilidad'//,
//          host: 'localhost',
//          user: 'root',
//          password:'pepirimini'
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
