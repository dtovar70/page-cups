# Manada Russo Creativa — Storefront and admin

React + Vite + TanStack Query + zustand. Talks to the `backend-cups` API (`VITE_API_URL`,
default `http://localhost:3000/api`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run lint
```

## Orders and payments (Phase 3)

- **Cart and checkout** show the USD total plus an approximate bolívar amount with the current
  BCV rate (`GET /exchange-rate/current`, `useExchangeRate`, `BsApproximation`). The exact Bs
  amount is fixed by the API when the order is created.
- **Checkout** (`/checkout`) sends the form and the cart lines to `POST /orders` (never prices).
  Field errors are pinned on the form; stock problems are shown per cart line with an "Ajustar mi
  carrito" button. If the Pago Móvil content is incomplete, or there is no usable BCV rate, the
  checkout shows a WhatsApp notice instead of taking the order.
- **Order page** (`/pedido/:code?t=<token>`): the private link returned once by the API. It shows
  the status and timeline, the Pago Móvil card (copy buttons and "Copiar todo"), the payment
  deadline, the proof form (reference, bank, phone, date, amount, screenshot) and every later
  status. It polls every 25 s while the payment is being verified and refetches on focus.
- **Late payments**: after the deadline, or once the order expired, the order page still shows
  the proof form ("El plazo venció, pero si ya hiciste el pago súbelo aquí y lo verificaremos")
  with a WhatsApp link; the API flags the payment as late. A cancelled order shows a WhatsApp
  notice instead ("Si hiciste un pago, escríbenos").
- **Personalization**: products tagged `personalizable` show an optional "Personalización" field
  (140 characters, counter, the product's print text as the example) and a WhatsApp link
  pre-filled with the product name. The text is part of the cart line identity (same product and
  variant with two texts are two lines), shows in the cart, drawer, checkout summary and order
  page, and is edited from the cart page. The persisted cart is version 2 (`migrate` keeps v1
  lines, without personalization). The order page links to WhatsApp with the order code for
  more details.
- **Mis pedidos** (`/mis-pedidos`, linked in the footer): the links of the orders placed from this
  browser, kept in `localStorage` (`manada-russo-recent-orders`; every access is guarded).
- **Admin**: `/admin/pedidos` (status chips with counts, a "Reembolsos pendientes" chip, search,
  dates, table or cards by width, flags per order: late payment, missing stock, pending refund,
  duplicate reference, amount off), `/admin/pedidos/:code` (alerts for late payments, stock
  conflicts and pending refunds; payments with the private screenshot viewer and their flags;
  each item's personalization with a copy button; actions through `ConfirmDialog`: confirming a
  payment with missing stock needs "Entiendo que falta stock", cancelling an order with a
  payment asks "¿Hay que devolver dinero al cliente?", "Reactivar pedido" (can be forced when
  stock is missing), "Registrar pago manualmente" (same form as the customer's) and "Marcar
  reembolso realizado"; history, internal notes) and `/admin/tasa-bcv` (current rate, last 30, manual
  rate for ADMIN, "Actualizar ahora"). The "Pedidos" nav item shows the number of payments waiting
  for verification (polled every 30 s).

- **Avisar por WhatsApp** (admin order detail): renders the current status's message on the API
  (with a fresh customer link), lets the owner edit it, and offers "Abrir WhatsApp" (a `wa.me`
  link in a new tab, which also leaves an internal note) and "Copiar mensaje". Without a mobile
  phone only copying is offered. The templates are edited in Catálogos → Estados de pedido
  (placeholder chips, counter, chat-bubble preview with sample data;
  `views/admin/catalogs/utils/whatsappTemplate.ts` mirrors the API's rules).
- **Descargar comprobante**: the purchase receipt PDF, on the customer's order page and the admin
  detail once the payment is verified (`receiptAvailable`).

**Field lengths.** `Input` caps text-like types (text, email, search, tel, url) at 100 characters
(`TEXT_INPUT_MAX_LENGTH`) unless a smaller `maxLength` is passed; `Textarea` requires `maxLength`.
Both show a "87/100" counter past 80% of limits of 20 or more (`showCount` shows it always). The zod
schemas and the API use the same limits.

**Admin login URL.** The address bar always reads `/admin/login`: the page to return to (`next`) and
why the session ended (`reason`) travel in navigation state (`adminLoginState`). Old
`?next=`/`?reason=` links are honored once and replaced with the clean URL.

## Catalogs

Order status labels, badge colors, customer texts and the admin order tabs come from
`GET /catalogs/order-statuses` (`useOrderStatusCatalog`, loaded once per session). Only the status
codes stay in code (`ORDER_STATUSES`): if the catalog cannot be loaded, pages show the codes
prettified ("Pendiente pago") instead of crashing. The banks of the Pago Móvil selects (payment
form, "Registrar pago manualmente", Contenido → Pago Móvil) come from `GET /catalogs/banks`
(`useBanks`). ADMIN users edit both at `/admin/catalogos` ("Catálogos"): status names, tones and
customer texts with a live preview, tab names and order, and banks (add, rename, activate,
reorder, delete when unused). Codes, the tab of each status and "final" are shown locked.
