
import nodemailer from 'nodemailer';

const send = (mailAddress, receiverEmail ,password, messageText)=>{

return new Promise((resolve, reject)=>{

    const transport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:mailAddress, 
            pass:password,
        },
    });

    const mailOption = {
        from:mailAddress, 
        to:receiverEmail,
        subject:"Тестовое сообщение", 
        text: messageText,
    };

    transport.sendMail(mailOption, (error, info)=>{
        if(error){
            reject(error);
        }
        else{
            resolve(info.response);
        }
    });
});

};

export {send}