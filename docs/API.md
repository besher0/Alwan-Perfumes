# REST API — Alwan Perfumes

Base: `http://SERVER_IP:3001/api` (HTTPS in production). Body and responses use JSON. All endpoints except login/health require `Authorization: Bearer <token>`.

| Method | Path | Action |
|---|---|---|
| GET | `/health` | Basic status (public) |
| POST | `/auth/login` | Owner login → JWT |
| GET | `/notes` | Read fragrance notes |
| GET | `/dashboard` | KPIs and last six purchases |
| GET | `/customers?search=` | List customers, optionally search |
| POST | `/customers` | Add customer (unique phone) |
| GET | `/customers/:id` | Customer plus purchases and favorites |
| PATCH | `/customers/:id/favorites` | Replace that customer's favorite note IDs |
| GET | `/customers/:id/analytics` | Per-customer averages/counts |
| GET | `/customers/:id/share-summary` | Text for WhatsApp and international phone |
| GET | `/purchases?customerId=` | Purchases sorted newest first |
| POST | `/purchases` | Save purchase; optionally update customer favorites atomically |

### Login

Request:
```json
{"username":"owner","password":"PASSWORD_FROM_ENV"}
```
Response:
```json
{"accessToken":"JWT_HERE","owner":{"id":"UUID","username":"owner"}}
```

### Create customer

```json
{"name":"ليان الخطيب","phone":"+963944238117","favoriteNoteIds":["lavender","jasmine"]}
```
Server normalizes phone to numeric international string, e.g. `963944238117`. Same phone yields HTTP 409.

### New purchase

```json
{
  "customerId":"CUSTOMER_UUID",
  "perfumeName":"عود ملكي",
  "purchasedAt":"2026-11-21",
  "rating":5,
  "primaryNoteId":"oud",
  "noteIds":["oud","rose","vanilla"],
  "favoriteNoteIds":["jasmine","amber"]
}
```

`primaryNoteId` **must be one of** `noteIds`, `rating` is 1–5, `noteIds` must be unique and nonempty. `favoriteNoteIds` is **optional**; if omitted, existing favorites are retained; if empty, favorites are cleared.

### Analytics response

```json
{
  "customerId":"CUSTOMER_UUID",
  "purchaseCount":2,
  "averageRating":4.5,
  "favoriteNoteIds":["lavender"],
  "mostLiked":[{"noteId":"rose","name":"ورد","count":2,"avgRating":4.5}],
  "mostPurchased":[{"noteId":"rose","name":"ورد","count":2,"avgRating":4.5}]
}
```

Errors use NestJS HTTP semantics: `400` invalid payload, `401` expired/missing login, `404` missing customer, `409` duplicate phone, `429` too many login attempts.
