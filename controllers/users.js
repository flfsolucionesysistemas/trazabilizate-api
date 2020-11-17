const pool = require('../config/database');


exports.addPersona= async (req, res) =>{
    let persona = req.body;
    await pool.query('INSERT INTO persona set ?', [persona], function(err, sql, fields){
           if(err){
               res.status(400).json({
                   error: 'No se ha podido guardar el persona'+err
               });
           }
           else{
               console.log('Se guardo correctamente');
               res.status(200).send({sql});
           }
    });
}



exports.addComercio= async (req, res) =>{
    let comercio = req.body;
    await pool.query('INSERT INTO comercio set ?', [comercio], function(err, sql, fields){
           if(err){
               res.status(400).json({
                   error: 'No se ha podido guardar el comercio'
               });
           }
           else{
               console.log('Se guardo correctamente');
               res.status(200).send({sql});
           }
    });



}
