const{Movie,validateMovie}=require('../models/movieModel');
const{Genre}=require('../models/genreModel');
const mongoose=require('mongoose');
const express=require('express');
const router=express.Router(); 
const validate=require('../middleware/validate');

//GET METHOD
router.get('/',async (req,res)=>{
    const movies=await Movie.find().sort('title'); 
    res.send(movies);
});
//POST METHOD
router.post('/',validate(validateMovie),async (req,res)=>{  
    const genre=await Genre.findById(req.body.genreId);
    if(!genre)return res.status(400).send('Invalid Genre');
    const movie = new Movie({
        title: req.body.title,
        genre:{
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.send(movie);
}
);

//PUT METHOD
router.put('/:id',async(req,res) =>{
    const{error}=validate(req.body);//Validate the client movie
    if (error)return res.status(400).send(error.details[0].message); 

    const genre=await Genre.findById(req.body.genreId);
    if(!genre)return res.status(400).send('Invalid genre');
    
    //Look up the movie
   const movie= await Movie.findByIdAndUpdate(req.params.id,
    {
        title:req.body.title ,
            genre:{
             _id:genre._id,
             name:genre.name
            },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
        },{new:true})

    if(!movie)return res.status(404).send('Movie not found');
//Return the updated movie
   res.send(movie);
});
//DELETE METHOD
router.delete('/:id',async(req,res)=>{
    //Look up the movie
    const movie= await Movie.findByIdAndRemove(req.params.id)
    if(!movie)return res.status(404).send('Movie not found');
    //Return the movie
    res.send(movie);
});
router.get('/:id',async(req,res)=>{
    //Look up the movie
   const movie= await Movie.findById(req.params.id);
   if(!movie)return res.status(404).send('Movie not found');
    res.send(movie);
});
module.exports=router;