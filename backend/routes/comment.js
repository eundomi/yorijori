const express = require("express");
const Comment = require("../models/schemas/comment");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  const { postId, responseTo, comment } = req.body;
  // postId, responseTo, comment내용은 req에서 받아오고,
  // case1. userId는 클라이언트의 쿠키에서 받아오도록한다.
  // case2. userId를 저장한 클라이언테에서 body에 내용을 함께 담아서 보낸다.
  // 두 방법중 어떤걸로 해야할까요?
  const { id: userId } = req.user;
  // req.user에는 { id: "... " } 형식으로 user의 id값이 저장되어있습니다.
  try {
    await Comment.create({
      postId,
      userId,
      responseTo,
      comment,
    });

    return res.status(201).json({ message: "댓글 등록이 완료되었습니다." });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 댓글 미리보기 버전
router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .exec();

    console.log(comments);
    return res.status(200).json({ comments });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 전체 댓글 페이지
router.get("/:postId/detail", async (req, res, next) => {
  // 걍 몇번째 page인지만 보내주면 되겠네. limit은 default로 10으로 줬으니.
  const { postId } = req.params;
  var page = Math.max(1, parseInt(req.query.page)); // 1. front의 input으로 넘겨주는 query들은 string으로 전달돼
  var limit = Math.max(1, parseInt(req.query.limit)); // 가령 소수점으로 넘겨올수도 있는데 이땐 걍 정수처리.
  page = !isNaN(page) ? page : 1; // 2. query값이 없을경우 사용되는 조건들.(처음으로 페이지 진입시 보여줌) 기본적으로 1번째 페이지의 정보들을 불러와줘.
  limit = !isNaN(limit) ? limit : 10; // 일단 처음엔 3개의 정보만 담는당.
  try {
    const skip = (page - 1) * limit;
    const count = await Comment.count({ postId }); // Comment의 개수를 불러와서
    const maxPage = Math.ceil(count / limit); // 최대 몇페이지까지 있는지 가져와

    // Comments에서 정의한 userId프로퍼티를 populate해서 해당 userId의 user정보도 함께 나오돋록 한다.
    const comments = await Comment.find({ postId })
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ createdAt: -1 }) // 최신순으루다가
      .skip(skip)
      .limit(limit)
      .exec();

    console.log(comments);
    return res.status(200).json({ comments, currentPage: page, maxPage, limit });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:postId/count", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const count = await Comment.count({ postId });
    console.log(count);
    return res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
