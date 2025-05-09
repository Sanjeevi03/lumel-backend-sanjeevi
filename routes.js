import { Router } from "express";
import multer from "multer";
import logger from "./utils/logger.js";
import FileData from "./models/FileData.js";
import csv from 'csv-parser';
import fs from 'fs';

const router = Router();

const uploads = multer({dest: 'uploads/'})

router.post('/file-upload', uploads.single('file'), async (req, res) => {
  try {
    const path = req.file.path;
    logger.info('file path:' + path)
    const data = new Promise((res, rej) => {
      let resu = []
      fs.createReadStream(path).pipe(csv()).on('data', (data) => resu.push(data)).on('end', ()=> res(resu)).on('error', (err) => rej(err));
    }) 
    const parsedData = await data || []
    if(parsedData && parsedData.length === 0) {
      return res.status(400).send({message: "Data not parsed."})
    }
    fs.unlinkSync(path)
    await FileData.insertMany(parsedData)
    logger.info("Data added successfully");
    res.status(201).send({message:"Data upload"})
  } catch(e) {
    logger.error(`${e.message}`);
    res.status(400).send({error: e.message})
  }
});

router.get('/getall', async (req, res) => {
    const data = await FileData.find().lean();
    res.send({ data });
})
router.get('/get-revenue', async (req, res) => {
   try {
    const {type, from, to, value} = req.query
    if (!type || !from || !to || !value) {
      return res.status(400).send({ error: 'Missing required query parameters' });
    }
    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const filter = {
      [type]: value,
      "Date of Sale": { $gte: from, $lte: to }
    };

    const data = await FileData.find(filter).lean();

      let totalRevenue = 0;

      data.forEach(item => {
        const quantity = Number(item["Quantity Sold"]);
        const unitPrice = parseFloat(item["Unit Price"]);
        const discount = parseFloat(item["Discount"]); // in percentage

        const gross = quantity * unitPrice;
        const discountAmount = (gross * discount) / 100;
        const revenue = gross - discountAmount;

        totalRevenue += revenue;
      });

      const obj = {
        type: type,
        value: value,
        from: from,
        to: to,
        totalRevenue
      }
      logger.info("Total Revenue:"+ obj);
      res.status(200).send({
        message:"calculate successfully",
        data: obj
      });
  } catch(e) {
    logger.error(`${e.message}`);
    res.status(400).send({error: e.message})
  }
});


router.delete("/clear-data", async (req, res) => {
  try {
    const deleteData = await FileData.deleteMany({});
    
    if (deleteData && deleteData.deletedCount > 0) {
      logger.info("Data cleared successfully")
      return res.status(200).send({message:"Data cleared"})
    } else {
      throw new Error("Data not cleared")
    }
  } catch(e) {
    logger.error(`${e.message}`);
    res.status(400).send({error: e.message})
  }
})

export default router;