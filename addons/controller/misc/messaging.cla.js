const nodemailer = require('nodemailer');

const General = require(MISC_CON + 'general.cla');

class Messaging {

    static logInfo(type, data){
        
        General.log(type,data,'info')
    }

    static logError(type, data){
        General.log(type,data,'error')
    }

    // SEND EMAIL
    static async sendEmail(data){
        // console.log(data);

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, //can be ommited
        port: process.env.SMTP_PORT, //can be omited
        secure: true, //can be omited
        tls: {
            // rejectUnauthorized: true,
            // minVersion: "TLSv1.2"
        },
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
        });

        let mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: data.receiver,
            subject: data.subject,
            text: data.message,
            html: this.htmlEmailTemplate(data)
        };
        try{
            const result = await transporter.sendMail(mailOptions);
            
            return true;
        }catch(err){
            Messaging.logError("Send Email Message [MESSAGING CLASS]", err);
            return false
        }

    }

    static subjectTemplate (type){
        let subject  = "";

        if(type === 'welcome'){
            subject = "WELCOME TO JEPH VTU";
        }

        return subject;
    }


    static messageTemplate (type, medium='email', data={}){
        let message = "";
        
        if(type === 'welcome'){
            message = "You have successfully register with Jeph VTU. We are delight to have you as our customer.";
        }


        return message;
    }
    

    static htmlEmailTemplate(data){
        const site_url = "";
        const media_url = "https://jeph-vtu.vercel.app/media/logo.png";
        const company_name = "Blog";

        return `
        <html>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
                <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>
                <link rel="stylesheet"href="https://fonts.googleapis.com/css?family=Roboto">
                <style>
                    .j-j-text-shadow{j-text-shadow: 7px 3px 5px;}
                    .j-text-color5{color:#fff!important}
                    .j-text-color7{color:#3a3a3a!important}
                </style>
            </head>

            <body id='body'class=''style='font-family:Roboto,sans-serif;'>
                <div style='padding: 20px; width:98%; max-width:800px;font-size:15px; background-color:#e9e3e3; margin:0 auto;'>
                    <br>
                    <center>
                        <a href="${site_url}"class='j-xxlarge j-j-text-shadow' style='padding: 15px 10px;color: teal;text-decoration: none;font-size: 35px;cursor: pointer;'>
                            <img src="${media_url}"class=''alt="${company_name} LOGO IMAGE"style="width:98%;max-width:500px;height:70px;">
                        </a>
                        <br>
                    </center>

                    <div class='j-text-color5'>
                        <p><b>Dear ${General.ucFirst(data.name)},</b></p>
                        <p>${data.message}</b></p>
                        <p>We appreciate your effort in being with us.</p>
                        <p>Best Regards.</p>
                        <p>${company_name} Team.</p><br>                           
                        <p>
                            You are receiving this mail, because you are a registered member/user of 
                            <a href="${site_url}" class=''style='color: #0072bf;text-decoration: none;cursor: pointer;'>
                                <b>${company_name}</b>
                            </a>.
                        </p>
                        <p>
                            if you did not request for this mail, kindly ignore.
                        </p>
                        <hr>
                        <div class='j-text-color5' style='font-family: Open Sans'>
                            <center>
                                <p>Copyright <?= date('Y');?> ${company_name} All rights reserved.</p>
                            </center>
                        </div>
                        <hr>
                    </div>
                    <br>
                </div>
            </body>

        </html>
        `;
    }
    
}

module.exports = Messaging;