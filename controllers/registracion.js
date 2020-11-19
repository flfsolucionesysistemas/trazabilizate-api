const pool = require('../config/database');


//begin addPersona
exports.addCheckIn=  async (req, res) =>{

  let params = req.body;
  let comercio = params.id_comercio;
  let qrcode = params.qrcode;

  let fechaHora= new Date().toLocaleString('es-ES', {
    timeZone: 'America/Argentina/Buenos_Aires'
  });


  //consulta a la base si el qrcode existe en persona, y me trae los datos de la persona
  let row = await pool.query('select * from persona where qrcode = ?', [qrcode]);
  if (row.length>0){
    console.log(row[0]);
      let registracion = {
        id_comercio : comercio,
        fecha_hora : fechaHora,
        id_persona : row[0].id_Persona
      }
     await pool.query('INSERT INTO registracion set ?', [registracion], function(err, sql, fields){
        if(err){
            res.status(400).json({
                error: 'No se ha podido guardar el comercio'+err
            });
        }
        else{
          console.log('Se guardo correctamente');
          res.status(200).send({sql});
        }
      });
  }else{
    console.log('no existe qrcode en la base');
  }

}
