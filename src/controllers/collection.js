const User = require("../database/user");

exports.collection = async (req, res) => {

console.log("inside collection")
    
    let id = req.params.id;
    console.log("🚀 ~ file: collection.js ~ line 6 ~ exports.collection= ~ id", id)
    let query = req.query
    console.log("🚀 ~ file: collection.js ~ line 7 ~ exports.collection= ~ query", query)
  
    let matchQuery={};
  if(query['authorName']!==undefined) {matchQuery.authorName = query['authorName']}
  if(query['collectionName']!==undefined) {matchQuery.collectionName = query['collectionName']}
  if(query['email']!==undefined) {matchQuery.email = query['email']}
  if(query['walletAddress']!==undefined) {matchQuery.walletAddress = query['walletAddress']}

  
  if(query['minimumVolume']!==undefined && query['maximumVolume']!==undefined) {matchQuery.volume = {$gte: parseFloat(query['minimumVolume']),$lte:parseFloat(query['maximumVolume'])} }
  else if(query['maximumVolume']!==undefined ) {matchQuery.volume = {$lte: parseFloat(query['maximumVolume']) }}
  else if(query['minimumVolume']!==undefined ) {matchQuery.volume = {$gte: parseFloat(query['minimumVolume']) }}
  

  if(query['minimumFloor']!==undefined && query['maximumFloor']!==undefined) {matchQuery.floorPrice = {$gte: parseFloat(query['minimumFloor']),$lte:parseFloat(query['maximumFloor'])} }
  else if(query['maximumFloor']!==undefined ) {matchQuery.floorPrice = {$lte: parseFloat(query['maximumFloor']) }}
  else if(query['minimumFloor']!==undefined ) {matchQuery.floorPrice = {$gte: parseFloat(query['minimumFloor']) }}


        console.log("🚀 ~ file: collection.js ~ line 10 ~ exports.collection= ~ matchQuery", matchQuery)

    let skip = (id - 1) * 9;

    const result = await User.aggregate([
        {
            "$facet": {
                "totalData": [
                    { "$match": matchQuery },
                    { "$sort" : { volume : -1 } },
                    { "$skip": skip },
                    { "$limit": 9 }
                ],
                "totalCount": [
                    { "$match": matchQuery },
                    {
                        "$count": "count"
                    }
                ]
            }
        }
    ])


    let user = result[0]?.totalData;
    console.log("🚀 ~ file: collection.js ~ line 29 ~ exports.collection= ~ user", user)

    // console.log("🚀 ~ file: collection.js ~ line 34 ~ exports.collection= ~ result[0]", result[0])  
    let count = result[0]?.totalCount[0]?.count ? result[0]?.totalCount[0]?.count : 0;
    console.log("🚀 ~ file: collection.js ~ line 48 ~ exports.collection= ~ count", count)
 
    
    res.send({ status: "success", user, count })
}