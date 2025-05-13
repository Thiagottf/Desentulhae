// backend/models/postModel.js
const knex = require('../config/config')

module.exports = {
all() {
    return knex('blog_post').select('*').orderBy('created_at', 'desc')
},
findById(id) {
    return knex('blog_post').where({ id }).first()
},
create(post) {
    return knex('blog_post').insert(post).returning('*')
},
update(id, changes) {
    return knex('blog_post').where({ id }).update(changes)
},
remove(id) {
    return knex('blog_post').where({ id }).del()
}
}
