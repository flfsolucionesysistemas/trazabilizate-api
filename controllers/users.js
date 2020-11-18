const pool = require('../config/database');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const PDF = require('html-pdf');
const fs = require('fs');
const Path = require('path');
const PDFDocument = require('pdfkit');
const Str = require('@supercharge/strings')


//begin addPersona
exports.addPersona= async (req, res) =>{
    let persona = req.body;
    let cadena = persona.dni+"-"+persona.num_tramite+"-"+persona.nombre+"-"+persona.apellido+"-"+persona.email;
    const qr = await qrcode.toDataURL(cadena);
    let   persona2 = {
          dni: persona.dni,
          apellido: persona.apellido,
          nombre : persona.nombre,
          telefono: persona.telefono,
          num_tramite: persona.num_tramite,
          email:persona.email,
          positivo: 0,
          qr:qr
      }
    console.log(persona2);
    // insert a la base
    await pool.query('INSERT INTO persona set ?', [persona2], function(err, sql, fields){
           if(err){
               res.status(400).json({
                   error: 'No se ha podido guardar el persona '+err
               });
           }
           else{
               console.log('Se guardo correctamente');
               res.status(200).send({sql});

              //pdf generacion
              var imgData = qr;
              var base64Data = imgData.replace(/^data:image\/png;base64,/, "");

              fs.writeFile("./public/pdf/qr-"+persona2.apellido+"-"+persona2.nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".png", base64Data, 'base64',
                  function(err, data) {
                  if (err) {
                         console.log('err', err);
                  }
                  console.log('success');
                  const doc = new PDFDocument;
                  doc.pipe(fs.createWriteStream("./public/pdf/pdf-"+persona2.apellido+"-"+persona2.nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".pdf"));
                  const content = `
                  Código QR para la persona  `+persona2.apellido+ ` - `+persona2.nombre+ `
                  Gobierno de la Provincia de Corrientes - 2020
                  Mail: `+persona2.email;
                  doc.text(content, 100, 100);
                  doc.image("./public/pdf/qr-"+persona2.apellido+"-"+persona2.nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".png", 320, 280, {scale: 1})
                      .text('Código QR', 320, 265);
                  doc.end();
                });

               //envio de mail
               var transporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                   user: 'flf.solucionesysistemas@gmail.com',
                   pass: 'everLAST2020'
                 }
               });
               var mailOptions = {
                 from: 'Trazate',
                 to: persona.email,
                 subject: 'QR de registracion',
                 text: 'esto es un mail de prueba',
                 html: '<h1>Bienvenido al primer sistema de trazabilidad en tiempo real, Su QR listo para ser usado</h1>',
                 attachments:[
                    {
                    //"path": "./public/images/logo.png"
                    "path": "./public/pdf/pdf-"+persona2.apellido+"-"+persona2.nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".pdf"
                    }
                    ]
               };
               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
           }
    });
}
//fin addPersona

//begin addComercio
exports.addComercio= async (req, res) =>{
    let comercio = req.body;
    const random = Str.random(10)
    let   comercio2 = {
          cuit: comercio.cuit,
          apellido: comercio.apellido,
          nombre : comercio.nombre,
          telefono: comercio.telefono,
          direccion: comercio.direccion,
          email:comercio.email,
          usuario: comercio.email,
          password: random
      }

    //insert  a la base
    await pool.query('INSERT INTO comercio set ?', [comercio2], function(err, sql, fields){
           if(err){
               res.status(400).json({
                   error: 'No se ha podido guardar el comercio'+err
               });
           }
           else{
               console.log('Se guardo correctamente');
               res.status(200).send({sql});
               //envio de mail
               var transporter = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                   user: 'flf.solucionesysistemas@gmail.com',
                   pass: 'everLAST2020'
                 }
               });

               var mailOptions = {
                 from: 'Trazate',
                 to: comercio2.email,
                 subject: 'Mail de registracion',
                 text: 'Mail donde se envian usuario y clave para el acceso a la plataforma',
                 html: '<h1>Bienvenido al primer sistema de trazabilidad en tiempo real, Su QR listo para ser usado</h1> <p>usuario: '+comercio2.email+' - clave: '+random+' </p>'
               };
               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });
           }
    });
}
//fin addComercio

//begin userLogin

exports.userLogin= async(req, res)=>{
	  var params = req.body
	  var usuario = params.usuario;
    var password = params.password;

    let row = await pool.query ('SELECT * FROM comercio where usuario = ? and password = ?', [usuario, password]);
    console.log(row.length);
		if (row.length>0){

      							res.status(200).send({
                                      ///token: jwt.createToken(usuario),
                                      ///message: "Comercio "+row[0].nombre+" "+row[0].apellido+" logeado"
									  res.status(200).send(row[0]);
      							});
      						///}else{
                                  ///res.status(200).send(usuario);

      						///}
      					///}else{
      						///res.status(404).send({message : 'El usuario no ha podido loguearse, revisar contraseña.'});
      					///}

			}
		else{
				res.status(404).send({message :'El usuario no esta registrado.'});
			}

	}
