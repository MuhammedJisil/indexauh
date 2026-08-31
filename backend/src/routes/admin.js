/**
 * Admin routes — all protected by requireAuth middleware.
 *
 * Document Types:  GET/POST /api/admin/document-types
 *                  DELETE   /api/admin/document-types/:id
 * Steps:           GET/POST /api/admin/document-types/:id/steps
 *                  PUT/DELETE /api/admin/steps/:stepId
 * Tracking:        GET/POST /api/admin/tracking
 *                  GET/PATCH/DELETE /api/admin/tracking/:id
 * Stats:           GET /api/admin/stats
 */
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Apply JWT auth to all routes in this file
router.use(requireAuth);

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Sends validation errors as a 400 response. Returns true if there were errors. */
function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return true;
  }
  return false;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const [statsRes, docRes] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int                                         AS total,
          COUNT(*) FILTER (WHERE status = 'Pending')::int      AS pending,
          COUNT(*) FILTER (WHERE status = 'In Progress')::int  AS in_progress,
          COUNT(*) FILTER (WHERE status = 'Completed')::int    AS completed,
          COUNT(*) FILTER (WHERE status = 'On Hold')::int      AS on_hold
        FROM tracking_records
      `),
      pool.query(`SELECT COUNT(*)::int AS total FROM document_types`),
    ]);

    res.json({ ...statsRes.rows[0], document_types: docRes.rows[0].total });
  } catch (err) {
    console.error('stats error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── Document Types ──────────────────────────────────────────────────────────

router.get('/document-types', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        dt.*,
        COUNT(DISTINCT sd.id)::int AS step_count,
        COUNT(DISTINCT tr.id)::int AS tracking_count
      FROM document_types dt
      LEFT JOIN step_definitions  sd ON sd.document_type_id = dt.id
      LEFT JOIN tracking_records  tr ON tr.document_type_id = dt.id
      GROUP BY dt.id
      ORDER BY dt.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('list doc-types error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post(
  '/document-types',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required.')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must be lowercase letters, numbers, and hyphens only.'),
  ],
  async (req, res) => {
    if (sendValidationErrors(req, res)) return;
    const { name, slug } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO document_types (name, slug) VALUES ($1, $2) RETURNING *`,
        [name, slug]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'A document type with this slug already exists.' });
      }
      console.error('create doc-type error:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

router.delete('/document-types/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM document_types WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Document type not found.' });
    res.json({ message: 'Document type deleted.' });
  } catch (err) {
    console.error('delete doc-type error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── Steps ────────────────────────────────────────────────────────────────────

router.get('/document-types/:id/steps', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM step_definitions WHERE document_type_id = $1 ORDER BY "order" ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('list steps error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post(
  '/document-types/:id/steps',
  [
    body('label').trim().notEmpty().withMessage('Step label is required.'),
    body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer.'),
  ],
  async (req, res) => {
    if (sendValidationErrors(req, res)) return;
    const { label, order } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO step_definitions (document_type_id, label, "order")
         VALUES ($1, $2, $3) RETURNING *`,
        [req.params.id, label, order]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error('create step error:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

router.put(
  '/steps/:stepId',
  [
    body('label').trim().notEmpty().optional().withMessage('Label cannot be empty.'),
    body('order').isInt({ min: 1 }).optional().withMessage('Order must be a positive integer.'),
  ],
  async (req, res) => {
    if (sendValidationErrors(req, res)) return;
    const { label, order } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE step_definitions
         SET label   = COALESCE($1, label),
             "order" = COALESCE($2, "order")
         WHERE id = $3
         RETURNING *`,
        [label ?? null, order ?? null, req.params.stepId]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Step not found.' });
      res.json(rows[0]);
    } catch (err) {
      console.error('update step error:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

router.delete('/steps/:stepId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM step_definitions WHERE id = $1 RETURNING id`,
      [req.params.stepId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Step not found.' });
    res.json({ message: 'Step deleted.' });
  } catch (err) {
    console.error('delete step error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── Tracking Records ────────────────────────────────────────────────────────

router.get('/tracking', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const offset = (page - 1) * limit;

    const params  = [];
    const where   = [];
    let   idx     = 1;

    if (req.query.status) {
      where.push(`tr.status = $${idx++}`);
      params.push(req.query.status);
    }
    if (req.query.search) {
      where.push(`tr.tracking_id ILIKE $${idx++}`);
      params.push(`%${req.query.search.trim()}%`);
    }

    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT
           tr.id, tr.tracking_id, tr.status, tr.remarks,
           tr.created_at, tr.updated_at,
           dt.id   AS doc_type_id,
           dt.name AS doc_type_name,
           cs.label   AS current_step_label,
           cs."order" AS current_step_order
         FROM tracking_records tr
         LEFT JOIN document_types   dt ON dt.id = tr.document_type_id
         LEFT JOIN step_definitions cs ON cs.id = tr.current_step_id
         ${whereSQL}
         ORDER BY tr.created_at DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        [...params, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*)::int AS total
         FROM tracking_records tr
         ${whereSQL}`,
        params
      ),
    ]);

    const total = countRes.rows[0].total;

    res.json({
      data: dataRes.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('list tracking error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post(
  '/tracking',
  [
    body('trackingId').trim().notEmpty().withMessage('Tracking ID is required.'),
    body('documentTypeId').isInt({ min: 1 }).withMessage('A valid document type is required.'),
    body('currentStepId').isInt({ min: 1 }).optional({ nullable: true }),
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed', 'On Hold'])
      .optional()
      .withMessage('Invalid status value.'),
    body('remarks').trim().optional(),
  ],
  async (req, res) => {
    if (sendValidationErrors(req, res)) return;
    const { trackingId, documentTypeId, currentStepId, status, remarks } = req.body;

    try {
      const { rows } = await pool.query(
        `INSERT INTO tracking_records
           (tracking_id, document_type_id, current_step_id, status, remarks)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          trackingId.trim().toUpperCase(),
          documentTypeId,
          currentStepId || null,
          status || 'Pending',
          remarks || null,
        ]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'A tracking record with this ID already exists.' });
      }
      console.error('create tracking error:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

router.get('/tracking/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         tr.*,
         dt.name        AS doc_type_name,
         cs.label       AS current_step_label,
         cs."order"     AS current_step_order
       FROM tracking_records tr
       LEFT JOIN document_types   dt ON dt.id = tr.document_type_id
       LEFT JOIN step_definitions cs ON cs.id = tr.current_step_id
       WHERE tr.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Tracking record not found.' });

    const stepsRes = await pool.query(
      `SELECT id, label, "order" FROM step_definitions
       WHERE document_type_id = $1 ORDER BY "order" ASC`,
      [rows[0].document_type_id]
    );

    res.json({ ...rows[0], steps: stepsRes.rows });
  } catch (err) {
    console.error('get tracking error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.patch(
  '/tracking/:id',
  [
    body('currentStepId').isInt({ min: 1 }).optional({ nullable: true }),
    body('status')
      .isIn(['Pending', 'In Progress', 'Completed', 'On Hold'])
      .optional()
      .withMessage('Invalid status value.'),
    body('remarks').trim().optional({ nullable: true }),
  ],
  async (req, res) => {
    if (sendValidationErrors(req, res)) return;

    const updates = [];
    const values  = [];
    let   idx     = 1;

    if ('currentStepId' in req.body) {
      updates.push(`current_step_id = $${idx++}`);
      values.push(req.body.currentStepId ?? null);
    }
    if ('status' in req.body) {
      updates.push(`status = $${idx++}`);
      values.push(req.body.status);
    }
    if ('remarks' in req.body) {
      updates.push(`remarks = $${idx++}`);
      values.push(req.body.remarks || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    values.push(req.params.id);

    try {
      const { rows } = await pool.query(
        `UPDATE tracking_records SET ${updates.join(', ')}
         WHERE id = $${idx} RETURNING *`,
        values
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Tracking record not found.' });
      res.json(rows[0]);
    } catch (err) {
      console.error('patch tracking error:', err.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

router.delete('/tracking/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM tracking_records WHERE id = $1 RETURNING id`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Tracking record not found.' });
    res.json({ message: 'Tracking record deleted.' });
  } catch (err) {
    console.error('delete tracking error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
