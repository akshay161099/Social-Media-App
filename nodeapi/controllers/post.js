const Post = require('../model/post');
const formidable = require('formidable');
const fs = require('fs');//filesystem
const _ = require("lodash")
exports.postById = (req,res,next,id)=>{
	Post.findBy(id)
	.populate("postedBy","_id name")
	.populate('comments.postedBy','text created')
	.populate('postedBy','_id name role')
	.exec((err,post)=>{
		if(err){
		return res.status(400).json({
			error: err
		})
	}
	req.post = post;
	next();
	});
};

exports.getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.postedBy", "_id name")
                .populate("postedBy", "_id name")
                .sort({ date: -1 })
                .limit(perPage)
                .select("_id title body likes");
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => console.log(err));
};

exports.createPost = (req,res,next) =>{
let form = new formidable.IncomingForm()

form.keepExtensions = true
form.parse(req,(err,fields,files)=>{
	if(err){return res.status(400).json({error:"Image could not be uploaded"})}
	let post  = new Post(fields)
	req.profile.hashed_password = undefined;
	req.profile.salt = undefined;
	post.postedBy = req.profile
	if(files.photo){
		post.photo.data = fs.readFileSync(files.photo.path)
		post.photo.contentType = files.photo.type
	}
	
	post.save((err,result)=>{
	if(err){return res.status(400).json({error:err})}
	res.json({result})
	})
})
}

exports.postsByUser = (req,res)=>{
Post.find({postedBy:req.profile._id}).populate("postedBy","_id name").select("_id title body created likes").sort("_created").exec((err,posts)=>{

	if(err){
	return res.status(400).json({error:err})
	}
res.json(posts);
});
};

exports.isPoster = (req,res,next)=>{
	let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
	let adminUser = req.post && req.auth && req.auth.role === "admin";
	let isPoster = sameUser || adminUser

	
	
	if(!isPoster)
	{
		return res.status(403).json({error: "User is not authprized"})
	}
	next()
};

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let post = req.post;
        // console.log("user in update: ", user);
        post = _.extend(post, fields);

        post.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }

            // console.log("user after update with formdata: ", user);
            res.json(post);
        });
    });
};

exports.deletePost = (req,res)=>{
	let post = req.post
	post.remove((err,post)=>{
		if(err)
		{
			return res.status(400).json({error: err});
		}
		res.json({message: "Deleted successfully"});
	})
}
exports.photo = (req,res,next) => {
	res.set("Content-Type",req.post.photo.contentType)
	return res.send(req.post.photo.data)
}

exports.singlePost = (req,res) => {
	return res.json(req.post);
}

exports.like = (req,res) => {
	Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}},
		{new: true}
		
		).exec((err,result)=>{
			if(err){
				return res.status(400).json({error:err})
			}else{
				res.json(result)
			}
		})
}

exports.unlike = (req,res) => {
	Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}},
		{new: true}
		
		).exec((err,result)=>{
			if(err){
				return res.status(400).json({error:err})
			}else{
				res.json(result)
			}
		})
}

exports.comment = (req,res) =>{
	let comment = req.body.comment
	comment.postedBy = req.body.userId

	Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}},
		{new: true}
		
		)
		.populate('comments.postedBy','_id name')
		.populate('postedBy',"_id name")
		.exec((err,result)=>{
			if(err){
				return res.status(400).json({error:err})
			}else{
				res.json(result)
			}
		})
}

exports.uncomment = (req,res) =>{
	let comment = req.body.comment
	

	Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id}}},
		{new: true}
		
		)
		.populate('comments.postedBy','_id name')
		.populate('postedBy',"_id name")
		.exec((err,result)=>{
			if(err){
				return res.status(400).json({error:err})
			}else{
				res.json(result)
			}
		})
}