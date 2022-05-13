
const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVAZS5jb20iLCJfaWQiOiI2Mjc5YmM5YzJkYWZkYzFhMTAwNjI4ZjkiLCJpYXQiOjE2NTIxNDY2NjEsImV4cCI6MTY1MjMxOTQ2MX0.IXYxSSg8zTK_oDxmYqTAzSz7lo1qBGOadSLLe39TsHo";
const jwt = require("jsonwebtoken");

const decoded = jwt.verify(token,"admslasjd9u3oif0f9i23fjodsjf09fsjfosj9f0ukKJABSKJABSKn82uijhdsf");
console.log(decoded);
