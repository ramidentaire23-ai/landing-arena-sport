const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration environnement
const NOEST_BASE_URL = process.env.NOEST_BASE_URL || 'https://app.noest-dz.com';
const NOEST_USER_GUID = process.env.NOEST_USER_GUID || 'UHGCDOGE';
const NOEST_API_TOKEN = process.env.NOEST_API_TOKEN || 'JlLZKsPRF6eClTd4v2NaDfS60JZLbgxtWfd';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '1422859033068055';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'EAANMcvfs0pMBSkSAVNYnWAtrg6z2enYUtWZAFpcQCuuGcbDpaIZBObDZBai0djWmxSLxOOIGHdtN61f6rEFj4Hzq3oBlr4vFxtZBtF7bL5JZAQqSOW1A05FIzZAWZCyyF8nWykCRvK3045l2197sNpJrpVkMpvV5GxALKfcPRn5coQD31bhMyQLtzZCavtBDnQZDZD';
const META_API_VERSION = process.env.META_API_VERSION || 'v19.0';
const STORE_WHATSAPP = process.env.WHATSAPP_PHONE || '213663407015';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Helper: SHA-256 pour Meta CAPI
function hashSha256(val) {
  if (!val) return null;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

// Helper: Normalisation E.164 numéro DZ (213...)
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = String(phone).replace(/[\s\-\.\+]/g, '');
  if (clean.startsWith('0')) clean = '213' + clean.slice(1);
  else if (!clean.startsWith('213')) clean = '213' + clean;
  return clean;
}

/**
 * Endpoint de création de commande :
 * 1. Création colis NOEST en direct
 * 2. Envoi événement Purchase via Meta Conversions API (CAPI)
 */
app.post('/api/orders', async (req, res) => {
  try {
    const {
      clientName,
      phone,
      wilayaId,
      commune,
      address,
      stationCode,
      deliveryType, // 'desk' ou 'home'
      variantId,
      variantName,
      quantity = 1,
      totalAmount,
      token
    } = req.body;

    if (!clientName || !phone || !wilayaId) {
      return res.status(400).json({ success: false, error: 'Champs obligatoires manquants.' });
    }

    const cleanPhone = normalizePhone(phone);
    const orderRef = 'ARENA-' + Math.floor(10000 + Math.random() * 90000);
    const isStopDesk = deliveryType === 'desk' ? 1 : 0;
    const finalAddress = isStopDesk 
      ? `مكتب NOEST [${stationCode || ''}] - ${address || ''}`
      : (address || 'توصيل للمنزل');

    console.log(`[ARENA SPORT] Traitement commande ${orderRef} pour ${clientName} (${cleanPhone})... Mode: ${deliveryType}`);

    // 1. Appel API NOEST
    let noestTracking = orderRef;
    let noestSuccess = false;

    if (NOEST_API_TOKEN && NOEST_USER_GUID) {
      try {
        const noestPayload = {
          user_guid: NOEST_USER_GUID,
          reference: orderRef,
          client: clientName.trim(),
          phone: String(phone).replace(/\s+/g, ''),
          adresse: finalAddress,
          wilaya_id: parseInt(wilayaId, 10),
          commune: isStopDesk ? '' : (commune || ''),
          montant: totalAmount || 3350,
          produit: `ARENA SPORT - Lunettes de sport (${variantName || variantId}) x${quantity}`,
          type_id: 1, // Livraison standard
          stop_desk: isStopDesk,
          station_code: isStopDesk ? (stationCode || '') : '',
          remarque: isStopDesk ? `استلام من مكتب NOEST [${stationCode || ''}]` : 'الاتصال قبل التوصيل'
        };

        const noestRes = await fetch(`${NOEST_BASE_URL}/api/public/create/order`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOEST_API_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(noestPayload)
        });

        if (noestRes.ok) {
          const noestData = await noestRes.json();
          if (noestData && noestData.success) {
            noestSuccess = true;
            noestTracking = noestData.tracking || orderRef;
            console.log(`[NOEST] Colis créé avec succès ! Tracking: ${noestTracking}`);
          } else {
            console.warn('[NOEST] Réponse API NOEST:', noestData);
          }
        } else {
          const errText = await noestRes.text();
          console.warn('[NOEST] Erreur statut HTTP:', noestRes.status, errText);
        }
      } catch (errNoest) {
        console.error('[NOEST] Échec requête:', errNoest.message);
      }
    }

    // 2. Dispatch Meta Conversions API (CAPI)
    if (META_ACCESS_TOKEN && META_PIXEL_ID) {
      try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';

        const capiPayload = {
          data: [
            {
              event_name: 'Purchase',
              event_time: Math.floor(Date.now() / 1000),
              event_id: orderRef, // Clé de déduplication identique au Pixel browser
              action_source: 'website',
              user_data: {
                ph: [hashSha256(cleanPhone)],
                fn: [hashSha256(clientName.split(' ')[0])],
                ln: [hashSha256(clientName.split(' ').slice(1).join(' '))],
                client_ip_address: clientIp.includes('::') ? '127.0.0.1' : clientIp,
                client_user_agent: userAgent
              },
              custom_data: {
                currency: 'DZD',
                value: parseFloat(totalAmount) || 3380,
                content_name: 'ARENA SPORT Lunettes de sport',
                content_type: 'product',
                num_items: parseInt(quantity, 10) || 1
              }
            }
          ]
        };

        fetch(`https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload)
        }).then(res => res.json()).then(data => {
          console.log('[Meta CAPI] Dispatch Purchase:', data);
        }).catch(err => {
          console.warn('[Meta CAPI] Échec envoi:', err.message);
        });
      } catch (errCapi) {
        console.warn('[Meta CAPI] Erreur préparation:', errCapi.message);
      }
    }

    // Réponse de succès au client
    return res.json({
      success: true,
      orderId: orderRef,
      tracking: noestTracking,
      noestSuccess,
      token: token || ('tok_' + Math.random().toString(36).substring(2))
    });

  } catch (error) {
    console.error('[Server] Erreur globale commande:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Récupération directe des tarifs NOEST en temps réel
app.get('/api/noest/fees', async (req, res) => {
  try {
    const response = await fetch(`${NOEST_BASE_URL}/api/public/fees`, {
      headers: {
        'Authorization': `Bearer ${NOEST_API_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    const fallback = require('../data/live_noest_fees.json');
    return res.json(fallback);
  } catch (err) {
    const fallback = require('../data/live_noest_fees.json');
    return res.json(fallback);
  }
});

// Récupération directe des 115 stations Stop Desk NOEST
app.get('/api/noest/desks', async (req, res) => {
  try {
    const response = await fetch(`${NOEST_BASE_URL}/api/public/desks`, {
      headers: {
        'Authorization': `Bearer ${NOEST_API_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
    const fallback = require('../data/live_noest_desks.json');
    return res.json(fallback);
  } catch (err) {
    const fallback = require('../data/live_noest_desks.json');
    return res.json(fallback);
  }
});

// Santé & Statut des services
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'ARENA SPORT DZ',
    noest_configured: !!(NOEST_API_TOKEN && NOEST_USER_GUID),
    meta_pixel_id: META_PIXEL_ID,
    meta_capi_configured: !!META_ACCESS_TOKEN,
    whatsapp: STORE_WHATSAPP
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur ARENA SPORT DZ actif sur http://localhost:${PORT}`);
    console.log(`📦 NOEST EXPRESS : ${NOEST_USER_GUID} (Connecté)`);
    console.log(`🎯 META PIXEL & CAPI : ${META_PIXEL_ID} (Connecté)`);
  });
}

module.exports = app;
