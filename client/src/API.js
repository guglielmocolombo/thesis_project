/*
    All the API calls
*/
const BASEURL = '/api';
 
/* MEMES */
async function getPrediction(signal, models, own) {

    let obj = {segnale: signal, models: models, own: own};
    const response = await fetch(BASEURL + '/prediction', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(obj) });
    const risultato = await response.json();
    
    return risultato;
}

async function processSignal(fileName, icaComponents) {
    // call: GET /api/images

    let obj = {fileName: fileName, icaComponents: icaComponents};
    const response = await fetch(BASEURL + '/processSignal', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(obj) });
    const risultato = await response.json();

    return risultato;
}

async function icaPreprocessing(fileName) {
    // call: GET /api/images
    const response = await fetch(BASEURL + '/icaPreprocessing/' + fileName);
    const risultato = await response.json();

    return risultato;
}



async function trainModel(algorithms, channels, modelName){

    let obj = {algorithms: algorithms, channels: channels, modelName: modelName};
    const response = await fetch(BASEURL + '/trainModel', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(obj) });
    const risultato = await response.json();

    return risultato;
}

async function voidFolder(){ 
    await fetch(BASEURL+'/voidFolder');
}

async function listFolder(){ 
    const response = await fetch(BASEURL+'/listFolder');
    const risultato = await response.json()

    return risultato;
}

async function availableModels(){ 
    const response = await fetch(BASEURL+'/availableModels');
    const risultato = await response.json()

    console.log(risultato)
    return risultato;
}

async function availableOwnModels(){ 
    const response = await fetch(BASEURL+'/availableOwnModels');
    const risultato = await response.json()

    return risultato;
}

async function deleteFiles(filesToDelete) {

    let obj = {files: filesToDelete};
    const response = await fetch(BASEURL + '/deleteFiles', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(obj) });
    await response.json();

}

async function insertFile(fileName, file) {

    let obj = {file: file, fileName: fileName};
    console.log(file)
    const response = await fetch(BASEURL + '/insertFile', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(obj) });
    const risultato = await response.json();

    return risultato;
}



const API = {processSignal, getPrediction, voidFolder, listFolder, deleteFiles, trainModel, icaPreprocessing, availableModels, availableOwnModels, insertFile};
export default API;
 