const pool = require('../config/database');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const PDF = require('html-pdf');
const fs = require('fs');
const Path = require('path');
const PDFDocument = require('pdfkit');




exports.addPersona= async (req, res) =>{
    let persona = req.body;
    let cadena = persona.dni+"-"+persona.num_tramite+"-"+persona.Nombre+"-"+persona.Apellido+"-"+persona.email;


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

              //pdf generacion
              var imgData = qr;
              var base64Data = imgData.replace(/^data:image\/png;base64,/, "");

              fs.writeFile("./public/pdf/qr-"+persona2.Apellido+"-"+persona2.Nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".png", base64Data, 'base64',
                  function(err, data) {
                  if (err) {
                         console.log('err', err);
                  }
                  console.log('success');
                  const doc = new PDFDocument;
                  doc.pipe(fs.createWriteStream("./public/pdf/pdf-"+persona2.Apellido+"-"+persona2.Nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".pdf"));
                  const content = `
                  Código QR para la persona  `+persona2.Apellido+ ` -   `+persona2.Nombre+ `
                  Gobierno de la Provincia de Corrientes - 2020
                  Mail: `+persona2.email;
                  doc.text(content, 100, 100);
                  doc.image("./public/pdf/qr-"+persona2.Apellido+"-"+persona2.Nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".png", 320, 280, {scale: 1})
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
                    "path": "./public/pdf/pdf-"+persona2.Apellido+"-"+persona2.Nombre+"-"+persona2.dni+"-"+persona2.num_tramite+".pdf"
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
