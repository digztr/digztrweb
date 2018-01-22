const Listing = require('../models/listing.model');
const ListingHeaderImage = require('../models/listing_header_images.js');
const axios = require('axios');
const async = require('async');
const fs = require('fs');
const request = require('request');
const uuid = require('node-uuid');
const knox = require('knox');
const config = require('../config/config');
/**
 * Get Listing list
 */
function list(req, res, next) {
  axios.get(`https://api.simplyrets.com/properties/`, {
    headers: {
      Authorization: `Basic ${Buffer.from('nav_4t3434y2:5644q3561335n05t').toString('base64')}`
    }
  }).then(response => {
    // console.log(response);
    let result = [];
    async.each(response.data, (listing, callback) => {
      Listing.get_by_mls(listing.mlsId).then(list => {
        if (list) {
          let address = ""
          Object.keys(listing.address).reverse().forEach(item => {
            if (listing.address[item]) {
              address+=`${listing.address[item]} `;
            }
          });
          result.push({
            _id: list._id,
            name: "RETS Property",
            address: address,
            meta: [
              {image:"house.svg",type:"Area",value:listing.property.area},
              {image:"bed.svg",type:"Bedrooms",value:listing.property.bedrooms},
              {image:"bathtub.svg",type:"Bathrooms",value:listing.property.bathrooms}
            ],
            price: listing.listPrice,
            url: `/listings/${list._id}`
          })
          callback();
        }else{
          // migrating of photos to s3

          // async.each(listing.photos, (photo, cb) => {
          //   let filename = uuid.v4();
          //   request
          //     .get(photo)
          //     .pipe(filename)
          //     .on('response', r => {
          //       // initialize knox client
        	// 			var knoxClient = knox.createClient({
        	// 				key: config.s3.key,
        	// 				secret: config.s3.secret,
        	// 				bucket: config.s3.bucket,
        	// 			});
          //
        	// 			// send put via knox
        	// 			knoxClient.putFile(
        	// 				filename,
        	// 				'uploads/' + filename,
        	// 				{
        	// 					'Content-Type': 'image/jpg',
        	// 					'x-amz-acl': 'public-read',
        	// 				},
        	// 				function(err, result) {
        	// 					if (err || result.statusCode != 200) {
        	// 						cb(err);
        	// 					} else {
        	// 						cb(null);
        	// 					}
        	// 				},
        	// 			);
          //     });
          // }, (err) => {
          //   if (err) {
          //     callback();
          //   }
          // });
          Listing.create({mlsId:listing.mlsId})
            .then(list => {
              let address = ""
              Object.keys(listing.address).reverse().forEach(item => {
                if (listing.address[item]) {
                  address+=`${listing.address[item]} `;
                }
              });
              result.push({
                _id: list._id,
                name: "RETS Property",
                address: address,
                meta: [
                  {image:"house.svg",type:"Area",value:listing.property.area},
                  {image:"bed.svg",type:"Bedrooms",value:listing.property.bedrooms},
                  {image:"bathtub.svg",type:"Bathrooms",value:listing.property.bathrooms}
                ],
                price: listing.listPrice,
                url: `/listings/${list._id}`
              })
              callback();
            });
        }
      }).catch(e => callback());
    }, err => {
      if (err) next(e)
      else res.json(result);
    });
  }).catch(e => next(e));
  // Listing.list()
  //   .then(listings => {
  //     let result = [];
  //     async.each(listings, (listing, callback) => {
  //       // if (listing.mlsId && listing.mlsId!=='') {
  //         console.log(listing);
  //         axios.get(`https://api.simplyrets.com/properties/${listing.mlsId}`, {
  //           headers: {
  //             Authorization: `Basic ${Buffer.from('nav_4t3434y2:5644q3561335n05t').toString('base64')}`
  //           }
  //         })
  //         .then(response => {
  //           response.data._id = listing._id;
  //           response.name = "RETS Property";
  //           let address = ""
  //           Object.keys(response.data.address).reverse().forEach(item => {
  //             if (response.data.address[item]) {
  //               address+=`${response.data.address[item]} `;
  //             }
  //           });
  //           result.push({
  //             _id: listing._id,
  //             name: "RETS Property",
  //             address: address,
  //             meta: [
  //               {image:"house.svg",type:"Area",value:response.data.property.area},
  //               {image:"bed.svg",type:"Bedrooms",value:response.data.property.bedrooms},
  //               {image:"bathtub.svg",type:"Bathrooms",value:response.data.property.bathrooms}
  //             ],
  //             price: response.data.listPrice,
  //             url: `/listings/${listing._id}`
  //           })
  //           callback();
  //         })
  //         .catch( e => callback())
  //       // }else{
  //       //   result.push({
  //       //     _id: listing._id,
  //       //     name: listing.name,
  //       //     address: listing.address,
  //       //     meta: listing.meta,
  //       //     price: listing.price,
  //       //     url: `/listings/${listing._id}`
  //       //   });
  //       //   callback();
  //       // }
  //     }, err => {
  //       if (err) next(e);
  //       else res.json(result);
  //     });
  //   })
  //   .catch(e => next(e));
}

/**
 * Get Listing by ID
 */
function show(req, res, next) {
  Listing.show(req.params.id)
    .then(listing => res.json(listing))
    .catch(e => next(e));
}

/**
 * Update Listing by id
 */
function update_features(req, res, next) {
  Listing.show(req.params.id)
    .then(listing => {
      listing.set({features: req.body});
      listing.save()
        .then(updatedListing => {
          if (updatedListing.hasOwnProperty('mlsId')) {
            axios.get(`https://api.simplyrets.com/properties/${updatedListing.mlsId}`, {
              headers: {
                Authorization: `Basic ${Buffer.from('nav_4t3434y2:5644q3561335n05t').toString('base64')}`
              }
            })
            .then(response => {
              updatedListing.populate('features.icon').exec()
                .then(populated => {
                  response._id = populated._id;
                  response.features = populated.features;
                  res.json(response);
                })
                .catch(e => next(e));
            })
            .catch(e => next(e));
          }else{
            res.json(updatedListing);
          }
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}



/**
 * Get RETS Mls by id
 */
function get_rets(req, res, next) {
  axios.get(`https://api.simplyrets.com/properties`, {
    headers: {
      Authorization: `Basic ${Buffer.from('nav_4t3434y2:5644q3561335n05t').toString('base64')}`
    }
  })
   .then(listing => {
     async.each(listing.data, (item, callback) => {
       Listing.get_by_mls(item.mlsId)
        .then(listing => {
          if (!listing) {
            Listing.create({mlsId:item.mlsId})
              .then(res => {
                item._id = res._id;
                item.features = [];
                callback();
              });
          }else{
            item.features = listing.features;
            item._id = listing._id;
            callback();
          }
        })
        .catch(e => next(e));
     }, (err) => {
       if (err) {

       }else{
         res.json(listing.data[0]);
       }
     });
     // listing.forEach(item => {
     //   Listing.get_by_mls(item.mlsId)
     //    .then(listing => {
     //      if (!listing) {
     //        Listing.create({mlsId:item.mlsId})
     //      }
     //    })
     // });
   })
   .catch(e => next(e));
}

/**
 * Get RETS Mls by id
 */
 function show_rets(req, res, next) {

   Listing.show(req.params.id)
    .then(listing => {
        axios.get(`https://api.simplyrets.com/properties/${listing.mlsId}`, {
          headers: {
            Authorization: `Basic ${Buffer.from('nav_4t3434y2:5644q3561335n05t').toString('base64')}`
          }
        })
        .then(response => {
          response.data.features = listing.features;
          response.data._id = listing._id;
          res.json(response.data);
        })
        .catch(e => next(e));

    })
    .catch(e => next(e));
 }

module.exports = {list,show,update_features,get_rets,show_rets};
