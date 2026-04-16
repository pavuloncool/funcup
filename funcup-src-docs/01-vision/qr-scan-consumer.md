# Kontekst: 
## Czym jest aplikacja **funcup**?
Aplikacja **funcup** jest areną **wymiany informacji** pomiędzy dwoma środowiskami:
1. `roaster` – palarnie kawy specialty;
2. `consumer` – konsumenci kawy specialty.
Oba środowiska łączy wspólna pasja: **kawa specialty**.
`roaster` jest przedsiębiorcą, wypala kawę i pakuje ją w opakowania detaliczne.
`consumer` jest konsumentem, który nabywa kawę – kupuje ją online lub stacjonarnie albo otrzymuje w prezencie.

## Dwie warstwy aplikacji
Aplikacja **funcup** zbudowana jest na architekturze Expo React i obsługuje dwie warstwy funkcjonalne:
1. `roaster-app`: strony, routing, funkcjonalności i UI/UX dedykowane do obsługi użytkownika `roaster`, dostępne wyłącznie w przeglądarce web browser;
2. `consumer-app`: strony, routing, funkcjonalności i UI/UX dedykowane dla użytkownika `consumer`, dostępne wyłącznie jako aplikacja iOS/Android na urządzeniach mobile.

### Separation of Concerns – Routing Core
`roaster-app` nie posiada wersji mobile, a jedynie wersję web browser.
`consumer-app` nie posiada wersji web, a jedynie wersję mobile iOS/Android.

## Metoda wymiany informacji pomiędzy `roaster` a `consumer`
Nośnikiem informacji pomiędzy środowiskami jest **kod QR**.
Kod QR może zostać wygenerowany wyłącznie w aplikacji (self-hosted QR model).
Kod QR jest generowany przez `roaster` i odczytowany przez `consumer`.

## Jak `roaster` generuje kod QR?
Aby wygenerować kod QR, Roaster wchodzi na stronę `create-coffee-tag.tsx` i uzupełnia metrykę produktu `roaster-coffee-tag`.
`roaster-coffee-tag` to zestaw informacji, które są zapisywane i przechowywane w bazie danych aplikacji (Supabase):
- Nazwa Roastera (`roaster-short-name` zasysana z profilu `roaster-profile`, wyświetlana jako URL do `roaster-profile`);
- Zdjęcie etykiety lub opakowania (url do `img-coffee-label` na serwerach 'funcup');
- Kraj pochodzenia ziarna `bean-origin-country` (field type: dropdown);
- Nazwa farmy ziarna `bean-origin-farm` (field type: text);
- Nazwa handlowa ziarna `bean-origin-tradename` (field type: text);
- Region uprawy ziarna `bean-origin-region` (field type: text);
- Gatunek kawy `bean-type` (field type: text);
- Odmiana dominująca ziarna `bean-varietal-main` (field type: text);
- Odmiany dodatkowe ziarna `bean-varietal-extra` (field type: text);
- Wysokość uprawy ziarna `bean-origin-height` (field type: number);
- Obróbka ziarna `bean-processing` (field type: dropdown);
- Data wypału ziarna `bean-roast-date` (field type: calendar);
- Stopień wypału `bean-roast-level` (field type: dropdown);
- Przeznaczenie `brew-method` (field type: dropdown);
Następnie kliknięcie `btn-generate-qr` przekształca uzupełnione informacje `roaster-coffee-tag` w kod QR w formacie .svg do pobrania.

**Koniec ścieżki generowania kodu QR przez Roastera**

### Skanowanie kawy przez `consumer`

`consumer`, po uruchomieniu aplikacji `consumer-app`, z poziomu ekranu **Coffee Hub** (główny ekran aplikacji `consumer-app`) uruchamia skaner kodów QR.
User skanuje kod QR z informacjami podanymi przez Roastera.
Aplikacja  wyświetla ekran `coffee-tag` z metryką kawy przedstawiającą informacje wprowadzonymi przez Roastera ().
Ekran 'Cofee Tag' zawiera dodatkowo pola, które `consumer` wypełnia:

```
Data nabycia (calendar)
Platforma zakupu (dropdown)'


Add Coffee to Journal' wyświetla dane coffee-roaster-data w postaci opisu oraz 
```

