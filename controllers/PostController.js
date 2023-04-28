import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cant get posts",
    });
  }
};
export const getOne = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    ).populate("user");

    res.json(doc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cant get posts",
    });
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body.title);

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "cant create post",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findOneAndDelete({
      _id: postId,
    })
      .exec()
      .then((counter) => res.json({ succ: true }))
      .catch((err) => {
        console.log(error);
        res.status(500).json({
          message: "cant gedeletet posts",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cant get posts",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cant update  posts",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "cant get posts",
    });
  }
};
