const mongoose=require('mongoose');
const cities=require('./cities')
const place=require('./seedsHelper')
const Hotel=require('../models/hotel');




mongoose.connect('mongodb://localhost:27017/hotel-review',{
    useNewUrlParser:true,
    useCreateIndex:true, 
    useUnifiedTopology:true,
    useFindAndModify:false
})


const db=mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open',()=>{
    console.log('Databse connected')
})


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async()=>{
    await Hotel.deleteMany({});
    for (let i=0;i<50;i++){
        const random=Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*80)+100
        
        const hotel=new Hotel({
            author:'603c3f7f023c51400dfa2ebc',
            location:`${cities[random].city}, ${cities[random].state}`,
            title:`${sample(place)}`,
            geometry: {
              type: "Point",
              coordinates: [cities[random].longitude,
              cities[random].latitude]
          },
            
            description:'Superb hotel, the best part of it remains its team members.Everyone is extremely professional and engaged with guests and their expectations.We will come back.',
            price:price,
            images: [
                {
                  
                  url: 'https://res.cloudinary.com/dulrdkthp/image/upload/v1614699478/Hoteladvisor/v1bghcrovpmhwtvc0hne.jpg',
                  filename: 'Hoteladvisor/v1bghcrovpmhwtvc0hne'
                },
                {
                 
                  url: 'https://res.cloudinary.com/dulrdkthp/image/upload/v1614699478/Hoteladvisor/oojz7gcnvxsn9gxd7ad9.jpg',
                  filename: 'Hoteladvisor/oojz7gcnvxsn9gxd7ad9'
                },
                {
                
                  url: 'https://res.cloudinary.com/dulrdkthp/image/upload/v1614699478/Hoteladvisor/psxkwlc7cgag4hs9i61p.jpg',
                  filename: 'Hoteladvisor/psxkwlc7cgag4hs9i61p'
                }
              ],
            

        })
        await hotel.save()
    }


}

seedDB().then(()=>{
    mongoose.connection.close()
})