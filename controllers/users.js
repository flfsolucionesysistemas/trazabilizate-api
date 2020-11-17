const pool = require('../config/database');
const qrcode = require('qrcode');

exports.addPersona= async (req, res) =>{
    let persona = req.body;
    let cadena = persona.dni+persona.num_tramite+persona.Nombre+persona.Apellido+persona.email;


    const qr = await qrcode.toDataURL(cadena);

    let   persona2 = {
          dni: persona.dni,
          Apellido: persona.Apellido,
          Nombre : persona.Nombre,
          telefono: persona.telefono,
          num_tramite: persona.num_tramite,
          email:persona.email,
          positivo: 0,
          qr:qr
      }

    console.log(persona2);


    await pool.query('INSERT INTO persona set ?', [persona2], function(err, sql, fields){
           if(err){
               res.status(400).json({
                   error: 'No se ha podido guardar el persona '+err
               });
           }
           else{
               console.log('Se guardo correctamente');
               res.status(200).send({sql});
           }
    });

    /*console.log(dataQR);
    let qr = await qrcode.toDataURL(dataQR)
      .then(dataQR => {
        console.log(dataQR)
      })
        .catch(err => {
          console.error(err)
        });
    console.log(qr);*/

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
