const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const {bookmarks} = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();


/*-------------------------
        /BOOKMARKS
-------------------------*/
bookmarksRouter.route('/bookmarks')
    .get( (req,res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req,res) => {

        const {title, URL, description, rating=5} = req.body;

        //validate
        if(!title){
            logger.error('Title is required');
            return res.status(400)
                .send('Invalid data');
        }

        if (!URL) {
            logger.error(`URL is required`);
            return res
            .status(400)
            .send('Invalid data');
        }

        if (!description) {
            logger.error(`Description is required`);
            return res
            .status(400)
            .send('Invalid data');
        }

        //url validation

        //get an id
        const id = uuid();

        const bookmark = {
            id,
            title,
            URL,
            description,
            rating
        };

        bookmarks.push(bookmark);

        //log
        logger.info(`Bookmark with id ${id} created`);
        
        //response
        res.status(201)
        .location(`http://localhost:8000/bookmark/${id}`)
        .json(bookmark)
    })


    //:id implementation

    bookmarksRouter.route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        
        const bookmark = bookmarks.find(b => b.id == id);

        //validate
        if(!bookmark){
            logger.error(`Bookmark with id ${id} not found`);
            return res
            .status(404)
            .send('Bookmark Not Found');
        }
        
        res.json(bookmark);
    })
    .delete( (req,res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

        //validate
        if(bookmarkIndex === -1 ){
            logger.error(`Bookmark with id ${id} not found`);
            return res
            .status(404)
            .send('Not Found');
        }

        //remove bookmark
        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted.`);

        res
        .status(204)
        .end();

    })

module.exports = bookmarksRouter;

