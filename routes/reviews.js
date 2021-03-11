const express=require('express');
const router=express.Router({mergeParams:true});
const wrap=require('../helpers/wrap');
const ExpressError = require('../helpers/expressError');
const baseJoi=require('joi')
const {isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')

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




const reviewValidation=(req,res,next)=>{

    const  reviewSchema=Joi.object({
 
         review:Joi.object({
             rating:Joi.number().required().min(0).max(5),
             body:Joi.string().required().escapeHTML(),
             title:Joi.string().required().escapeHTML()
         }).required()
     
     })
 
     const {error}=reviewSchema.validate(req.body);
     if (error){
         const msg=error.details.map(el=>el.message).join(',')
 
         throw new ExpressError(msg,400)
     }else{
         next()
     }
 
 }



router.post('/',isLoggedIn,reviewValidation,wrap(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrap(reviews.deleteReview))


module.exports=router;