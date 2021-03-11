const express=require('express');
const router=express.Router();
const wrap=require('../helpers/wrap')
const ExpressError = require('../helpers/expressError');
const hotels=require('../controllers/hotels')
const baseJoi=require('joi')
const {isLoggedIn, isAuthor}=require('../middleware');
const {storage}=require('../cloudinary')
const  multer  = require('multer')
const upload = multer({ storage})

const sanitizeHtml=require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi=baseJoi.extend(extension)




const validation=(req,res,next)=>{
    const hotelSchema=Joi.object({
        hotel:Joi.object({
            title:Joi.string().required().escapeHTML(),
            price:Joi.number().required().min(0),
            //image:Joi.string().required(),
            location:Joi.string().required().escapeHTML(),
            description:Joi.string().required().escapeHTML()
        }).required(),
        deleteImages:Joi.array()
    })

    
    const {error}=hotelSchema.validate(req.body);
    if (error){
        const msg=error.details.map(el=>el.message).join(',')

        throw new ExpressError(msg,400)
    }else{
        next()
    }
}
router.route('/')
   .get(wrap(hotels.index))
   .post(isLoggedIn,upload.array('image'),validation, wrap(hotels.createNewHotel))

   

router.get('/new',isLoggedIn,hotels.renderNewForm);


router.route('/:id')
   .get(wrap(hotels.showHotel))
   .put(isLoggedIn,isAuthor,upload.array('image'),validation,wrap(hotels.editHotel))
   
   .delete(isAuthor,isLoggedIn,wrap(hotels.deleteHotel))





router.get('/:id/edit',isLoggedIn,isAuthor ,wrap(hotels.renderEditForm));






module.exports=router