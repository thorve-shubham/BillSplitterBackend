const { User } = require("../model/user");
const { Group } = require("../model/group");

const shortId = require("shortid");
const winstonLogger = require("../libs/winstonLib");
const generateResponse = require("../libs/responseLib");
const isEmpty = require("../libs/checkLib");
const history = require("../libs/historyLib.js");

async function createGroup(req, res) {
  const createdBy = await User.findOne({ userId: req.body.createdBy }).select(
    "userId firstName lastName"
  );

  const members = await User.find({ userId: { $in: req.body.members } }).select(
    "userId firstName lastName"
  );

  let group = new Group({
    groupId: shortId.generate(),
    groupName: req.body.groupName,
    createdBy: {
      userId: req.body.createdBy,
      userName: createdBy.firstName + " " + createdBy.lastName,
    },
    createdOn: new Date(),
  });

  for (let x of members) {
    group.members.push({
      userId: x.userId,
      userName: x.firstName + " " + x.lastName,
    });
  }

  await group.save();
  group.toObject();
  winstonLogger.info("Group Created Successfully");

  let historydata = {
    groupId: group.groupId,
    message: req.body.userName + " Created Group named : " + group.groupName,
  };

  if (await history(historydata)) {
    return res.send(
      generateResponse(200, false, group, "Group Created Successfully")
    );
  }

  //add history
}

async function getByUserId(req, res) {
  const groups = await Group.find({ "members.userId": req.body.userId }).sort({
    createdOn: -1,
  });

  if (isEmpty(groups)) {
    return res.send(generateResponse(404, true, null, "No Groups Found"));
  } else {
    return res.send(generateResponse(200, false, groups, "Groups Found"));
  }
}

async function getByGroupId(req, res) {
  const group = await Group.findOne({ groupId: req.body.groupId }).sort({
    createdOn: -1,
  });

  if (isEmpty(group)) {
    return res.send(generateResponse(404, true, null, "No Group Found"));
  } else {
    group.toObject();
    return res.send(generateResponse(200, false, group, "Group Found"));
  }
}

module.exports.createGroup = createGroup;
module.exports.getByUserId = getByUserId;
module.exports.getByGroupId = getByGroupId;
