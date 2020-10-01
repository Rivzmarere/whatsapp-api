const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");
const messagebird = require('messagebird')("k5vyFNgWdtkOruwXUqbOKKzf3", null, ["ENABLE_CONVERSATIONSAPI_WHATSAPP_SANDBOX"]);

const app = express();
// Middleware
app.use(bodyParser.json());

//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition:{
    info:{
      title: 'Whatsapp API',
      description: "whatsapp API information",
      contact:{
        name: "whatsapp Developer"
      },
      servers:["http://localhost:3000"]
    }
  },
  //['.routes/*.js]
  apis: ["app.js"]
};



const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs));

//Routes
/**
 * @swagger
 * /whatsapp:
 *   post:
 *     description: Use to request all customers
 *     parameters:
 *       - in: body
 *         name: 
 *         schema:
 *           type: object
 *           required:
 *             - message
 *           properties:
 *             quantity:
 *               type: string
 *             depature:
 *               type: string
 *             time:
 *               type: string
 *             url:
 *               type: string
 *     responses:
 *       '200': 
 *         description: Succesful Message
 *       '400':
 *         description: Failed Message
 * 
 */
app.post("/whatsapp", (req, res) => {

// start a conversation
try {
    messagebird.conversations.start({
    'to': '263719412450',
    'channelId': '39fb0d5aacf540b091ba53b3fddef8f3',
    'type': 'hsm',
      'content': {
        'hsm': {
          'namespace': '332195f8_05e0_4e61_bad0_22e756621a53',
          'templateName': 'notifications',
          'language': {
            'policy': 'deterministic',
            'code': 'en'
          },
          'params': [
            {"default": req.body.quantity},
            {"default": req.body.depature},
            {"default": req.body.time},
            {"default": req.body.url},
          ]
        }
      }
    }, (err, response) => {
      if (err) {
      console.log(err);
      res.json({success: false, ...err}).status(400);
      }
      console.log(response);
      res.json({success:true, ...response}).status(200);
    });
} catch (error) {
    console.log(error);
    res.json({success: false, ...error}).status(400);
    }
    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Running on Port ${PORT}`)); 