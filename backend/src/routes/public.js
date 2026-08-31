/**
 * Public tracking route — GET /api/track/:trackingId
 * Used by the Astro frontend (server-side fetch).
 * Returns a response shape compatible with the existing track-document.astro.
 */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';

const router = Router();

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/track/:trackingId', publicLimiter, async (req, res) => {
  const rawId = req.params.trackingId.trim().toUpperCase();

  // Basic sanity check — tracking IDs are alphanumeric with hyphens only
  if (!/^[A-Z0-9\-]{1,30}$/.test(rawId)) {
    return res.status(404).json({ error: 'Tracking record not found.' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         tr.id,
         tr.tracking_id,
         tr.status,
         tr.remarks,
         tr.created_at,
         tr.updated_at,
         dt.id          AS doc_type_id,
         dt.name        AS doc_type_name,
         dt.slug        AS doc_type_slug,
         cs.id          AS current_step_id,
         cs.label       AS current_step_label,
         cs."order"     AS current_step_order
       FROM tracking_records tr
       LEFT JOIN document_types  dt ON dt.id = tr.document_type_id
       LEFT JOIN step_definitions cs ON cs.id = tr.current_step_id
       WHERE tr.tracking_id = $1`,
      [rawId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tracking record not found.' });
    }

    const row = rows[0];

    // All steps for this document type (for the stepper UI)
    const stepsRes = await pool.query(
      `SELECT id, label, "order"
       FROM step_definitions
       WHERE document_type_id = $1
       ORDER BY "order" ASC`,
      [row.doc_type_id]
    );

    // Response shape matches what the existing track-document.astro expects
    const response = {
      trackingId:     row.tracking_id,
      trackingStatus: row.status,
      remarks:        row.remarks,
      document_type: {
        id:          row.doc_type_id,
        name:        row.doc_type_name,
        slug:        row.doc_type_slug,
        stepEntries: stepsRes.rows.map((s) => ({
          id:    s.id,
          label: s.label,
          order: s.order,
        })),
      },
      current_step: row.current_step_id
        ? { id: row.current_step_id, label: row.current_step_label, order: row.current_step_order }
        : null,
    };

    res.json(response);
  } catch (err) {
    console.error('Public track error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
