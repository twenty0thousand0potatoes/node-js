document.getElementById("upload").addEventListener("click", () => { 
    let file = document.getElementById("file").files[0]; 
    let reader = new FileReader(); 
    reader.readAsBinaryString(file); 
    reader.onload = () => { 
        fetch("/upload", { 
            method: "POST", 
            body: JSON.stringify({ body: reader.result, name: file.name }), 
        }); 
    }; 
});