
import nodemailer from 'nodemailer';

const send = (mailAddress, password, messageText)=>{

    const transport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:mailAddress, 
            pass:password,
        },
    });

    const mailOption = {
        from:mailAddress, 
        to:mailAddress,
        subject:"Тестовое сообщение", 
        text: messageText,
    };

    transport.sendMail(mailOption, (error, info)=>{
        if(error){
            console.error('Ошибка при отправке сообщения: ', error);
        }
        else{
            console.log('Сообщение отправлено: ', info.response);
        }
    });

};

export {send}