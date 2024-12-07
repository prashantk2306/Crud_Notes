const express = require('express');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
   fs.readdir(`./uploads`,(err,files)=>{
    if(err) throw err
  const fileList =  files.map(file =>{
    const content = fs.readFileSync(`./uploads/${file}`,'utf8')
    return {filename: file, content}
    })
  res.render('data',{fileList})  
})
})

app.get('/form',(req,res)=>{
    res.render('form')
})

app.get('/show/:readfile',(req,res)=>{
    fs.readFile(`./uploads/${req.params.readfile}`,'utf8',(err, data)=>{
      if(err) throw err
      res.send(data)
    })
})

app.get('/update/:updatefile',(req,res)=>{
   res.render('update',{filename: req.params.updatefile})
  })
app.get('/delete/:filename',(req,res)=>{
   fs.unlink(`./uploads/${req.params.filename}`,(err)=>{
    if(err) throw err
    res.redirect('/')
   })
  })
  
  app.get('/rename',(req,res)=>{
    // path
    const oldName = `./uploads/${req.query.currentName}`
    const newName = `./uploads/${req.query.newName}.txt`
    // rename filename
    fs.rename(oldName,newName,(err)=>{
      if(err) throw err
      res.redirect('/')
    }) 

  })

  // edit content
  app.get('/edit/:filename',(req,res)=>{
    const filename = req.params.filename
    fs.readFile(`./uploads/${filename}`,'utf8',(err,content)=>{
      if(err) throw err
      res.render('editContent',{filename, content})
    })
  })
   
  app.get('/submit-edit',(req,res)=>{
    const {filename,filedata} = req.query;
    fs.writeFile(`./uploads/${filename}`,filedata,(err)=>{
      if(err) throw err
      res.redirect('/')
    })
  })

app.get('/submit',(req,res)=>{
    fs.writeFile(`uploads/${req.query.filename}.txt`,req.query.filedata,(err)=>{
        if(err) throw err;
        res.redirect('/')
    })
})

app.listen(3000)
