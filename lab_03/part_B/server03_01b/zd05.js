
function square(num) {
    return new Promise((resolve, reject) => {
        setTimeout( ()=>{
            if ( !isNaN(num)) {
                resolve(num * num);
            } else {
                reject('Invalid input. Please provide a valid number.');
            }
        } , 1500)
        
    });
}


function cube(num) {
    return new Promise((resolve, reject) => {
        setTimeout( ()=>{
            if (!isNaN(num)) {
                resolve(num * num * num);
            } else {
                reject('Invalid input. Please provide a valid number.');
            }
        } , 500)
    });
}

function fourthPower(num) {
    return new Promise((resolve, reject) => {

        setTimeout( ()=>{
            if ( !isNaN(num)) {
                resolve(Math.pow(num, 4));
            } else {
                reject('Invalid input. Please provide a valid number.');
            }
        } , 1000)
         
    });
}

export {square, cube, fourthPower}



