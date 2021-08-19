const { Schema, model } = require("mongoose");


const messageSchema = new Schema(
  {
receiver: { type: Schema.Types.ObjectId, ref: "User" },
sender:{ type: Schema.Types.ObjectId, ref: "User" },
content: String,
  },
  {
    timestamps: true
  }
);


module.exports = model('Message', messageSchema);
