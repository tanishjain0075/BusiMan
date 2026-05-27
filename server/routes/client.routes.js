const express = require('express');
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/client.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const { validate } = require('../middleware/validate.middleware');
const { clientSchema, updateClientSchema } = require('../validators/client.validator');

router.use(protect);

router.get('/', getClients);
router.get('/:id', getClient);
router.post('/', authorize('admin', 'accountant', 'sales'), validate(clientSchema), createClient);
router.put('/:id', authorize('admin', 'accountant', 'sales'), validate(updateClientSchema), updateClient);
router.delete('/:id', authorize('admin'), deleteClient);

module.exports = router;
