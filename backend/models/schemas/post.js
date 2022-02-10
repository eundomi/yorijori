const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    //레시피명
    recipeName: {
      type: String,
      required: true,
    },
    //요리 소개
    desc: {
      type: String,
      required: true,
    },
    //재료소개
    ingredient: [
      {
        ingreName: { type: String, required: true },
        ingreCount: { type: String, required: true },
      },
    ],
    //양념소개
    seasoning: [
      {
        ingreName: { type: String, required: true },
        ingreCount: { type: String, required: true },
      },
    ],
    process: [
      {
        explain: { type: String, required: true },
        processTime: {
          min: { type: Number },
          sec: { type: Number },
        },
        processImage: { type: String, default: null },
        processImageKey: { type: String, default: null },
      },
    ],

    //조리과정 받는 곳
    copyImage: [{ type: String, required: true }],
    copyImageKey: [{ type: String, required: true }],
    // // 썸네일
    thumbnail: { type: String, required: true },
    thumbnailKey: { type: String, default: null },
    //완성 사진을 받는 부분입니다.
    doneImage: [{ type: String, default: null }],
    doneImageKey: [{ type: String, default: null }],
    //종류별
    category: {
      type: String,
      required: true,
    },
    //상황별 :
    condition: {
      type: String,
      required: true,
    },
    //재료별
    material: {
      type: String,
      required: true,
    },
    //방법별
    cook: {
      type: String,
      required: true,
    },
    //인원수
    servings: {
      type: String,
      required: true,
    },
    //요리 시간
    time: {
      type: String,
      required: true,
    },
    //난이도
    diffic: {
      type: String,
      required: true,
    },
    //작성글을 유저와 연결합니다
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //DB에는 삭제안되지만, 게시물 조회할때 useYN:true 인 값만 노출되어주는 컬럼
    useYN: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("numLikes", {
  ref: "Like",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

module.exports = PostSchema;
