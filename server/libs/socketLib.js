const socket = require("socket.io");

const { retrieveGroupMembers } = require("./retrieveEmails");

module.exports = function (app) {
  const MainSocket = socket.listen(app).of("billSplitter");

  MainSocket.on("connection", (user) => {
    console.log("someone connected");

    user.on("expenseCreated", async (data) => {
      const userIds = await retrieveGroupMembers(data.expenseId, "");

      for (let id of userIds) {
        MainSocket.emit(id, {
          Message: data.expenseName + " Expense has been Created..",
          expenseId: data.expenseId,
          userId: data.userId,
        });
      }
    });

    user.on("expenseDeleted", async (data) => {
      const userIds = await retrieveGroupMembers("", data.groupId);

      for (let id of userIds) {
        MainSocket.emit(id, {
          Message: data.expenseName + " Expense has been Deleted..",
          expenseId: data.expenseId,
          userId: data.userId,
        });
      }
    });

    user.on("expenseUpdated", async (data) => {
      const userIds = await retrieveGroupMembers(data.expenseId, "");

      for (let id of userIds) {
        MainSocket.emit(id, {
          Message: data.expenseName + " Expense has been Updated..",
          expenseId: data.expenseId,
          userId: data.userId,
        });
      }
    });

    user.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
