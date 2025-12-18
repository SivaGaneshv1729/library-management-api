const FineService = require('../services/fineService');

const fineController = {
  payFine: async (req, res, next) => {
    try {
      const result = await FineService.payFine(req.params.id);
      res.json({ message: "Payment successful", data: result });
    } catch (error) { next(error); }
  }
};

module.exports = fineController;