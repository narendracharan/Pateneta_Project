const ideaRequestSchema = require("../../models/userModels/productModel");
const { error, success } = require("../../responseCode");

//------->  new IdeaRequest Api
exports.ideaRequestList = async (req, res) => {
  try {
    const {from,to}=req.body
    const list = await ideaRequestSchema.find({
        $and:[
            from ?{createdAt:{$gte:new Date(from)}}:{},
            to ?{createdAt :{$lte :new Date(`${to}T23:59:59`)}}:{}
          ]
    }).populate("user_Id").sort({createdAt:-1});
    res.status(200).json(success(res.statusCode, "Success", { list }));
  } catch {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//------> Approved Idea Request Api
exports.approvedIdea = async (req, res) => {
  try {
    const id = req.params.id;
    var status = "APPROVED";
    const appreovedIdea = await ideaRequestSchema.findByIdAndUpdate(
      id,
      { verify: status },
      { new: true }
    );
    res
      .status(200)
      .json(success(res.statusCode, "Approved idea", { appreovedIdea }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-------> Decline Request Api
exports.DeclineIdea = async (req, res) => {
  try {
    const id = req.params.id;
    let status = "REJECTED";
    let data = {
      verify: status,
      declineReason: req.body.declineReason,
    };
    const declineData = await ideaRequestSchema.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(success(res.statusCode, "Success", { declineData }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

//-----> view Idea Request Api
exports.viewIdeaRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const detailIdea = await ideaRequestSchema.findById(id).populate("user_Id");
    res.status(200).json(success(res.statusCode, "Success", { detailIdea }));
  } catch (err) {
    res.status(400).json(error("Failed", res.statusCode));
  }
};

///----> search Idea Api

exports.searchIdeaRequest=async(req,res)=>{
    try{
        const search = req.body.search;
        if (!search) {
          return res
            .status(201)
            .json(error("Please provide search key", res.statusCode));
        }
        const searchIdeas = await ideaRequestSchema.find({
          $and: [
            { title_en: { $regex: new RegExp(search.trim(), "i") } },
            { description_en: { $regex: new RegExp(search.trim(), "i") } },
            { category_en: { $regex: new RegExp(search.trim(), "i") } },
            { subCategory_en: { $regex: new RegExp(search.trim(), "i") } },
            { briefDescription_en: { $regex: new RegExp(search.trim(), "i") } },
          ],
        });
        if (searchIdeas.length > 0) {
          return res
            .status(200)
            .json(success(res.statusCode, "Success", { searchIdeas }));
        } else {
          res.status(201).json(error("Ideas are not Found", res.statusCode));
        }
    }catch(err){
        res.status(400).json(error("Failed",res.statusCode))
    }
}