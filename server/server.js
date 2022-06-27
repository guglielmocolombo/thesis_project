'use strict';

import {PythonShell} from 'python-shell';

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import availableModels from './model.js';

const app = new express();
app.use(express.json());

const port = 5000

app.get('/api/icaPreprocessing/:name', async (req, res) => {
  
  var name = req.params.name
  let finish = await runIca(name);

  res.json(finish);  
  });

async function runIca(name) {
  var options = {
    args: [name]
  };

  const { success, err = '', results } = await new Promise(
    (resolve, reject) => {

      PythonShell.run('ica_preprocessing.py', options, function (err, results) {
        if (err)
          reject({ success: false, err })

        results = 1
        resolve({ success: true, results });
      });
    }
  );

  if (!success) {
    return err;
  }

  return results;
}

app.post('/api/trainModel', async (req, res) => {

  let algorithms = req.body.algorithms;
  let channels = req.body.channels;
  let modelName = req.body.modelName;

  let finish = await runTraining(algorithms, channels, modelName);

  res.json(finish);  
  });

async function runTraining(algorithms, channels, modelName) {
  

  var options = {
    args: [algorithms, channels, modelName]
  };

  const { success, err = '', results } = await new Promise(
    (resolve, reject) => {

      PythonShell.run('train_model.py', options, function (err, results) {
        if (err)
          reject({ success: false, err })

        let modelChannels = results[results.length - 1];
        let modelMean = results[results.length - 2];
        let modelStd = results[results.length -3];
        let modelDescription = 'model description'

        console.log('END TRAINING')

        for (let model of algorithms){
          model =  model.replace(/\s+/g, '');
          insertModel(modelName+'_'+model, modelChannels, modelDescription, modelMean, modelStd)
        }

        resolve({ success: true, results });
      });
    }
  );

  if (!success) {
    return err;
  }

  return results;
}


//python function for computation
app.post('/api/processSignal', async (req, res) => {

let fileName = req.body.fileName
let icaComponents = req.body.icaComponents
let finish = await runPreProcessing(fileName, icaComponents);

res.json(finish);
  
});

async function runPreProcessing(fileName, icaComponents)
{
  if(icaComponents.length==0)
      icaComponents = ['void']

  var options = {
    args: [fileName, icaComponents]
  };

    const { success, err = '', results } = await new Promise(
        (resolve, reject) =>
        {
          
          PythonShell.run('signalProcessing.py', options, function (err, results) {
            if (err) 
              reject({ success: false, err })

            //results = JSON.stringify(results[results.length-2]);
            results = results[results.length-1];
            resolve({ success: true, results });
          });
        }
    );

    if(!success){
        return err;
    }

    return results;
}

app.post('/api/prediction', async (req, res) => {

  let results = []
  let signal = req.body.segnale;
  let models = req.body.models;
  let own = req.body.own

  for(const m of models){
    let value = await getModel(m)
    console.log(value.docs[0].modelChannels)
    console.log(signal)
    let finish = await runPrediction(signal, m, value.docs[0].modelChannels, value.docs[0].modelMean, value.docs[0].modelStd, own); //send only one model at a time
    results.push({name:m, result:finish})
  }
  
  res.json(results);  
  });

async function runPrediction(signal, model, channels, mean, std, own)
  {
    
    // let channels = availableModels.filter(mo => mo.name === model).map(m => m.channels)
    
    var options = {
      args: [signal, model, channels, mean, std]
    };
    
    let to_run = ''
    if(own){
      to_run = 'predictionOwn.py'
    } else {
      to_run = 'prediction.py'
    }
    
      const { success, err = '', results } = await new Promise(
          (resolve, reject) =>
          {
            
            PythonShell.run(to_run, options, function (err, results) {
              if (err) 
                reject({ success: false, err })
  
              results = results[results.length - 1];
              
              resolve({ success: true, results });
            });
          }
      );
  
      if(!success){
          return err;
      }
  
      return results;
  }

  app.post('/api/deleteFiles', async (req, res) => {

    const directory = 'file';
  
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
  
      for (const file of files) {
        if (req.body.files.incudes(file)) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      }
    });
      
    });

app.get('/api/voidFolder', async (req, res) => {

  const directory = 'file';

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
    
  });

  app.get('/api/listFolder', async (req, res) => {

    const dir = 'file';
    const files = fs.readdirSync(dir)
    
    const list_files = []
    for (const file of files) {
      list_files.push(file);
    }

    res.json(list_files);
    
  });

  app.get('/api/availableModels', async (req, res) => {

    const dir = 'model';
    const files = fs.readdirSync(dir)
    
    const list_files = []
    for (const file of files) {
      list_files.push(file);
    }

    res.json(list_files);
    
  });
  
    app.get('/api/availableOwnModels', async (req, res) => {

      const dir = 'new_model';
      const files = fs.readdirSync(dir)

      const list_files = []
      for (const file of files) {
        list_files.push(file);
      }

      res.json(list_files);
    });

const storageA = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'file/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const storageB = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'controls_file/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const storageC = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'patients_file/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const storageD = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'new_model/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})


const uploadA = multer({ storage: storageA })
const uploadB = multer({ storage: storageB })
const uploadC = multer({ storage: storageC})
const uploadD = multer({ storage: storageD})

app.use(cors())

/*
app.post('/file', upload.single('file'), function (req, res) {
  res.json({})
})
*/

app.post('/upload_files', uploadA.array('files'), function (req, res) {
  res.json({})
})
app.post('/upload_controls', uploadB.array('files'), function (req, res) {
  res.json({})
})
app.post('/upload_patients', uploadC.array('files'), function (req, res) {
  res.json({})
})
app.post('/upload_newModel', uploadD.array('files'), function (req, res) {
  res.json({})
})

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



//////////////////////////////////////////////////// COUCH DB /////////////////////////////////////////////////////////////////

import Nano from "nano";
let nano = Nano('http://admin:admin@localhost:5984');


app.get('/api/createDatabase', async (req, res) => {

  nano.db.create('alice').then((data) => {
    console.log("suca")
  }).catch((err) => {
    // failure - error information is in 'err'
  })

  }
)


async function insertModel(modelName, modelChannels, modelDescription, modelMean, modelStd){

  const models = nano.use('models');
  const response = await models.insert({ modelName: modelName, modelChannels: modelChannels, modelDescription: modelDescription, modelMean: modelMean, modelStd: modelStd}, modelName)

}

async function getModel(modelName){

  console.log(modelName)
  const models = nano.use('models');
  let result = await models.find({
    "selector": {
        "modelName": modelName
    },
    "fields": ["id", "modelName", "modelChannels", "modelDescription", "modelMean", "modelStd"],
});

  return result;
}
app.post('/api/insertModel', async (req, res) => {

  const modelName = req.body.modelName;
  const modelChannels = req.body.modelChannels;
  const modelDescription = req.body.modelDescription

  
  const models = nano.use('models');
  const response = await models.insert({ modelName: modelName, modelChannels: modelChannels, modelDescription: modelDescription}, modelName)

})
