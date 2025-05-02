exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then((result) =>{
            console.log(result, ("result topicExists"));
            
            if(result.rows.length === 0) {
                Promise.reject({ msg : 'invalid topic', status: 404 })
            }
        })
}